#!/bin/bash
SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE:-$0}"); pwd)
cd $SCRIPT_DIR

function depends(){
    [ $# -lt 1 ] && echo 'USAGE: depends "command1,message1" "command2,message2" ...'
    [ $# -lt 1 ] && exit 1

    local COMMANDS=""
    for i in "$@"
    do
        local COMMAND=$(echo $i|cut -d, -f1)
        COMMANDS="$COMMAND $COMMANDS"
        local MESSAGE=$(echo $i|cut -d, -f2)
        which $COMMAND >/dev/null|| echo "$MESSAGE"
    done
    which $COMMANDS >/dev/null || exit 1
}


set -e
depends "curl,Please install curl" "git,Please install git." \
        "jq,Please install jq. brew install jq or see https://stedolan.github.io/jq/" \
        "yq,Please install yq. brew install python-yq see https://github.com/kislyuk/yq or https://yq.readthedocs.io"

source .env

STORAGE_DIR=./storage

if [ ! -d $STORAGE_DIR ]
then
    git clone $DATA_STORE_REPO $STORAGE_DIR
fi

# for feed in $(cat $STORAGE_DIR/$FEED_SOURCES)
# do
#     curl -L "$feed" | xq '.rss.channel.item[]|{url: .link, item: .}'
# done
