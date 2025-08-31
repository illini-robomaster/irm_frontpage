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
REBUILD=false
STOP=false
while getopts ":rs" opt; do
  case ${opt} in
  r)
    REBUILD=true
    ;;
  s)
    STOP=true
    ;;
  ?)
    echo "Invalid option: -${OPTARG}" >&2
    exit 1
    ;;
  esac
done

FILEPATH=$(realpath "${0}")
DIRPATH=$(dirname "${FILEPATH}")
ROOTPATH=$(dirname "${DIRPATH}")

source "${DIRPATH}/conf.sh"
mkdir -p "${LOGDIR}"

LOG=${LOGDIR}/docker-deploy.log
CLOUDFLARED_CONFIG_CACHE="${ROOTPATH}/cached_config"

function check_packages() {
  echo Check packages: "${@}" >>"${LOG}"
  which "${@}" >/dev/null
  if [ ${?} -ne 0 ]; then
    echo - Missing packages.
    exitl 1
  else
    echo - No missing packages. >>"${LOG}"
  fi
}

function get_cloudflared_config() {
  CF_CONF_CACHE=${1}
  # Check if we have a cached config
  if [ -f "${CF_CONF_CACHE}" ] && [ -s "${CF_CONF_CACHE}" ]; then
    echo "Using cached cloudflared configuration..." >>"${LOG}"
    source "${CF_CONF_CACHE}"
  else
    echo "No cached configuration found. Please provide cloudflared settings:" >>"${LOG}"
    echo "Note: Leave blank to skip cloudflared configuration."

    # Ask for tunnel ID
    read -p "Cloudflared Tunnel ID: " CLOUDFLARED_TUNNEL_ID
    if [ "${CLOUDFLARED_TUNNEL_ID}" ]; then
      # Ask for domain
      read -p "Domain (e.g., example.com): " CLOUDFLARED_DOMAIN
      # Ask for token
      read -p "Cloudflared Tunnel Token (optional): " CLOUDFLARED_TUNNEL_TOKEN

      # Save to cache file with secure permissions
      umask 077
      echo "CLOUDFLARED_TUNNEL_ID=${CLOUDFLARED_TUNNEL_ID}" >"${CF_CONF_CACHE}"
      echo "CLOUDFLARED_DOMAIN=${CLOUDFLARED_DOMAIN}" >>"${CF_CONF_CACHE}"
      echo "CLOUDFLARED_TUNNEL_TOKEN=${CLOUDFLARED_TUNNEL_TOKEN}" >>"${CF_CONF_CACHE}"
      umask 022
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
  REBUILD=${2:-false}
  D_CON_NAME=${3}
  # Check if image already exists
  if [ "${REBUILD}" = true ]; then
    echo "Rebuilding Docker image..." >>"${LOG}"
    stop_container "${D_CON_NAME}" 2
    echo "Building Docker image..." >>"${LOG}"
    docker build -t "${D_IMG_NAME}" "${ROOTPATH}" 2>&1 | tee -a "${LOG}"
    if [ ${?} -ne 0 ]; then
      echo "Failed to build Docker image" >>"${LOG}"
      exitl 1
    fi
    echo "Docker image rebuilt successfully" >>"${LOG}"
  else
    # Check if image exists
    if docker image inspect "${D_IMG_NAME}" >/dev/null 2>&1; then
      echo "Docker image already exists. Skipping build." >>"${LOG}"
    else
      echo "Docker image does not exist. Building..." >>"${LOG}"
      docker build -t "${D_IMG_NAME}" "${ROOTPATH}" 2>&1 | tee -a "${LOG}"
      if [ $? -ne 0 ]; then
        echo "Failed to build Docker image" >>"${LOG}"
        exitl 1
      fi
      echo "Docker image built successfully" >>"${LOG}"
    fi
  fi
}

function deploy_containers() {
  echo Deploying containers... >>"${LOG}"
  # Use docker-compose to deploy with environment variables
  if [ "${CLOUDFLARED_TUNNEL_ID}" ] && [ "${CLOUDFLARED_DOMAIN}" ]; then
    CLOUDFLARED_TUNNEL_ID="${CLOUDFLARED_TUNNEL_ID}"
    CLOUDFLARED_DOMAIN="${CLOUDFLARED_DOMAIN}"
    CLOUDFLARED_TUNNEL_TOKEN="${CLOUDFLARED_TUNNEL_TOKEN}"
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

  if [ "${STOP}" == "true" ]; then
    stop_container "${DOCKER_CONTAINER_NAME}"
    exitl 0
  fi

  # Build the Docker image
  build_image "${DOCKER_IMAGE_NAME}" "${REBUILD}" "${DOCKER_CONTAINER_NAME}"

  get_cloudflared_config "${CLOUDFLARED_CONFIG_CACHE}"

  deploy_containers

  exitl 0
}

main
