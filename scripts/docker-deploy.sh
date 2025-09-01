#!/bin/bash
#
# Copyright (C) 2025 RoboMaster.
# Illini RoboMaster @ University of Illinois at Urbana-Champaign
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#

# Parse command line arguments
REBUILD=
STOP=
HELP=$(
  cat <<EOF
Builds and runs the Docker image/container.
Usage: ${0} [-r] [-s | -S [level]] [-h]
    -r    Rebuild Docker image
    -S [level]    0: stop container
                  1: 0 and remove container
                  2: 0, 1, and delete image
    -s    Same as -S 0
    -h    Show this message
EOF
)
while getopts ":hrsS" opt; do
  case ${opt} in
  r)
    REBUILD=1
    ;;
  s)
    STOP=0
    ;;
  S)
    STOP=${OPTARG:-0}
    ;;
  h)
    echo -e "${HELP}"
    exit 0
    ;;
  ?)
    echo "Invalid option: -${OPTARG}" >&2
    echo "Use -h for help"
    exit 1
    ;;
  esac
done

FILEPATH=$(realpath "${0}")
DIRPATH=$(dirname "${FILEPATH}")
ROOTPATH=$(dirname "${DIRPATH}")

source "${DIRPATH}/conf.sh"
mkdir -p "${LOGDIR}"

LOG=${LOGDIR}/docker_deploy.log
CLOUDFLARED_CONFIG_CACHE="${ROOTPATH}/cached_config"

function check_packages() {
  echol Check packages: "${@}"
  if ! which "${@}" >/dev/null; then
    echo - Missing packages.
    exitl 1
  else
    echol - No missing packages.
  fi
}

function get_cloudflared_config() {
  CF_CONF_CACHE=${1}
  # Check if we have a cached config
  if [ -f "${CF_CONF_CACHE}" ] && [ -s "${CF_CONF_CACHE}" ]; then
    echol Using cached cloudflared configuration...
    source "${CF_CONF_CACHE}"
  else
    echol No cached configuration found. Please provide cloudflared settings:
    echo Note: Leave blank to skip cloudflared configuration.

    # Ask for tunnel ID
    read -p "Cloudflared Tunnel ID: " CLOUDFLARED_TUNNEL_ID
    if [ "${CLOUDFLARED_TUNNEL_ID}" ]; then
      # Ask for domain
      read -p "Domain (e.g., example.com): " CLOUDFLARED_DOMAIN
      # Ask for token
      read -p "Cloudflared Tunnel Token (optional): " CLOUDFLARED_TUNNEL_TOKEN

      # Save to cache file
      (
        umask 077
        cat <<EOF >"${CF_CONF_CACHE}"
CLOUDFLARED_TUNNEL_ID=${CLOUDFLARED_TUNNEL_ID}
CLOUDFLARED_DOMAIN=${CLOUDFLARED_DOMAIN}
CLOUDFLARED_TUNNEL_TOKEN=${CLOUDFLARED_TUNNEL_TOKEN}
EOF
      )
    fi
  fi

  # Export variables for docker-compose
  export CLOUDFLARED_TUNNEL_ID
  export CLOUDFLARED_DOMAIN
  export CLOUDFLARED_TUNNEL_TOKEN
}

function stop_container() {
  CON=${1}
  LVL=${2:-0}

  IMG=$(docker inspect --format '{{.Image}}' "${CON}")

  [ $(docker ps -a -f name="${CON}" | wc -l) -ne 2 ] && {
    echo Container "${CON}" does not exist. >>"${LOG}"
    return
  }

  echo "Stopping ${CON}..." >>"${LOG}"
  docker stop "${CON}" 2>&1 | tee -a "${LOG}"
  if [ "${LVL}" -ge 1 ]; then
    echo "Removing ${CON} container..." >>"${LOG}"
    docker rm "${CON}" 2>&1 | tee -a "${LOG}"
  fi
  if [ "${LVL}" -ge 2 ]; then
    echo "Removing ${IMG} image..." >>"${LOG}"
    docker rmi "${IMG}" 2>&1 | tee -a "${LOG}"
  fi
}

function build_image() {
  D_IMG_NAME=${1}
  REBUILD=${2}
  D_CON_NAME=${3}
  # Check if image already exists
  if [ "${REBUILD}" ]; then
    echol Rebuilding Docker image...
    echol Removing "${D_CON_NAME}" container and image...
    stop_container "${D_CON_NAME}" 2
    echol Building Docker image...
    if ! docker build -t "${D_IMG_NAME}" "${ROOTPATH}" 2>&1 |
      tee -a "${LOG}"; then
      echol Failed to build Docker image
      exitl 1
    fi
    echol Docker image rebuilt successfully
  else
    # Check if image exists
    if docker image inspect "${D_IMG_NAME}" >/dev/null 2>&1; then
      echol Docker image already exists. Skipping build.
    else
      echol Docker image does not exist. Building...
      docker build -t "${D_IMG_NAME}" "${ROOTPATH}" 2>&1 | tee -a "${LOG}"
      if [ $? -ne 0 ]; then
        echol Failed to build Docker image
        exitl 1
      fi
      echol Docker image built successfully
    fi
  fi
}

function deploy_containers() {
  CLOUDFLARED_TUNNEL_ID=${1}
  CLOUDFLARED_DOMAIN=${2}
  CLOUDFLARED_TUNNEL_TOKEN=${3}
  echol Deploying containers...
  # Use docker-compose to deploy with environment variables
  if [ "${CLOUDFLARED_TUNNEL_ID}" ] && [ "${CLOUDFLARED_DOMAIN}" ]; then
    CLOUDFLARED_TUNNEL_ID="${CLOUDFLARED_TUNNEL_ID}"
    CLOUDFLARED_DOMAIN="${CLOUDFLARED_DOMAIN}"
    CLOUDFLARED_TUNNEL_TOKEN="${CLOUDFLARED_TUNNEL_TOKEN}"
    echo ${CLOUDFLARED_TUNNEL_TOKEN}
    docker-compose -f "${ROOTPATH}/docker-compose.yml" up -d 2>&1 | tee -a "${LOG}"
  else
    # Deploy without cloudflared config
    docker-compose -f "${ROOTPATH}/docker-compose.yml" up -d 2>&1 | tee -a "${LOG}"
  fi
}

function main() {
  startl

  REQUIRED_PACKAGES="docker docker-compose"
  check_packages ${REQUIRED_PACKAGES}

  if [ "${STOP}" ]; then
    stop_container "${DOCKER_CONTAINER_NAME}" "${STOP}"
    exitl 0
  fi

  # Build the Docker image
  build_image "${DOCKER_IMAGE_NAME}" "${REBUILD}" "${DOCKER_CONTAINER_NAME}"

  # Sets `CLOUDFLARED_TUNNEL_ID`, `CLOUDFLARED_DOMAIN`,
  # `CLOUDFLARED_TUNNEL_TOKEN`
  get_cloudflared_config "${CLOUDFLARED_CONFIG_CACHE}"

  deploy_containers "${CLOUDFLARED_TUNNEL_ID}" "${CLOUDFLARED_DOMAIN}" \
    "${CLOUDFLARED_TUNNEL_TOKEN}"

  exitl 0
}

main
