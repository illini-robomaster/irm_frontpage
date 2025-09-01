#!/bin/bash
# Env vars
FILEPATH=$(realpath "${0}")
DIRPATH=$(dirname "${FILEPATH}")
ROOTPATH=$(dirname "${DIRPATH}")
LOGDIR=${ROOTPATH}/log
DOCKER_IMAGE_NAME=irm-frontpage     # Also change in `docker-compose.yml`
DOCKER_CONTAINER_NAME=irm-frontpage # Also change in `docker-compose.yml`

####################################

# Funs
function startl() {
  cat <<EOF >>"${LOG}"

====================
Start $(date)
====================
EOF
}

function exitl() {
  n=${1:-0}
  [ "${n}" -ne 0 ] && echo Check log in ${LOG}.
  cat <<EOF >>${LOG}
====================
Exit(${1}) $(date)
====================

EOF
  exit "${n}"
}
