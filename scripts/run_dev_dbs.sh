#!/bin/sh
#
# Usage: run from project directory: ./scripts/run_dev_dbs.sh
# Description: kill/clear/run redis & mongo with docker for dev environment
# Prerequirements: docker
#

usage()
{
  echo "usage: ./scripts/run_dev_dbs.sh [-k|-c|-r]"
  echo "  -k|--kill  : kill redis and mongo docker containers"
  echo "  -c|--clear : create/clear mongodb host folder"
  echo "  -r|--run   : run redis and mongo containers"
  echo "example: ./scripts/run_dev_dbs.sh -k -c -r"
}

# Check for docker availability
command -v docker >/dev/null 2>&1 || { echo >&2 "'docker' is not installed. Aborting."; exit 1; }

DATA_DIR="../docker/mongodb"

clear=
kill=
run=

[ $# -eq 0 ] && { usage; exit 1; }
while [ "$1" != "" ]; do
  case $1 in
    -k | --kill )     kill=1 ;;
    -c | --clear )    clear=1 ;;
    -r | --run )      run=1 ;;
    * )               usage; exit 1 ;;
  esac
  shift
done

if [ "$kill" = "1" ]; then
  docker kill redis mongo >/dev/null 2>&1 || echo "Containers not running."
fi

if [ "$clear" = "1" ]; then
  mkdir -p "$DATA_DIR"
  rm -rf "$DATA_DIR"/*
fi

if [ "$run" = "1" ]; then
  name='redis'
  if [ "$(docker ps -f "name=$name" --format '{{.Names}}')" != "$name" ]; then
    docker run --rm -d -p 6379:6379 --name "$name" redis --save ''
  fi

  name='mongo'
  if [ "$(docker ps -f "name=$name" --format '{{.Names}}')" != "$name" ]; then
    docker run --rm -d -p 27017-27019:27017-27019 -v "$(pwd)/$DATA_DIR:/data/db" --name "$name" mongo:latest
  fi
fi
