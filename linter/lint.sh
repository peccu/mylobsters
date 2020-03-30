#!/bin/bash
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE:-$0}"); pwd)
cd $SCRIPT_DIR
../init-hook.sh
[ -x ../../.toolbox.sh ] && . ../../.toolbox.sh
docker-compose run --rm lint linter/build/lint.sh
