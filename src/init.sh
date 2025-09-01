#!/bin/sh
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
LOGDIR=/var/log/container
CFDIR=/etc/cloudflared
CF_LOG=${LOGDIR}/docker_cloudflared.log
LH_LOG=${LOGDIR}/docker_lighttpd.log

mkdir -p "${LOGDIR}"

# Handle cloudflared configuration from environment variables
if [ -n "${CLOUDFLARED_TUNNEL_ID}" ] && [ -n "${CLOUDFLARED_DOMAIN}" ]; then
  echo "Generating cloudflared config from environment variables..."
  # Update tunnel ID and hostname in config file
  cp -v "${CFDIR}"/config.yml "${CFDIR}"/config.yml.old
  awk -v tunnel_id="${CLOUDFLARED_TUNNEL_ID}" -v domain="${CLOUDFLARED_DOMAIN}" '
    /^tunnel:/ {
      print "tunnel: " tunnel_id
      next
    }
    /^  - hostname:/ {
      print "  - hostname: " domain
      next
    }
    { print }
  ' "${CFDIR}"/config.yml.old >"${CFDIR}"/config.yml
fi

# Global variables for process management
CLOUDFLARED_PID=

# Signal handler function
handle_signal() {
  echo "Received SIGTERM or SIGINT, shutting down gracefully..."

  # Kill cloudflared if it's running
  if [ -n "${CLOUDFLARED_PID}" ]; then
    echo "Stopping cloudflared (PID: ${CLOUDFLARED_PID})..."
    kill -TERM "${CLOUDFLARED_PID}" 2>/dev/null
    wait "${CLOUDFLARED_PID}"
  fi

  # Exit the script
  exit 0
}

# Set up signal traps
trap handle_signal TERM INT

# Start cloudflared in background if token is provided
if [ -n "${CLOUDFLARED_TUNNEL_TOKEN}" ]; then
  echo "Starting cloudflared with provided tunnel token..."
  cloudflared tunnel --no-autoupdate run --token "${CLOUDFLARED_TUNNEL_TOKEN}" >>"${CF_LOG}" 2>&1 &
  CLOUDFLARED_PID=$!
  echo "Cloudflared started with PID: ${CLOUDFLARED_PID}"
fi

echo "Starting lighttpd in foreground..."
exec /usr/sbin/lighttpd -D -f /etc/lighttpd/lighttpd.conf >>"${LH_LOG}" 2>&1
