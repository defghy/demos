#!/bin/bash

ENV="local"
while getopts "e:" arg
do
  case $arg in
    e)
      ENV=$OPTARG
      ;;
    ?)
    echo "含有未知参数"
    exit 1
    ;;
  esac
done

echo "ENV "$ENV
cp ./config/$ENV.env ./config/.env

pm2 start ./config/pm2.config.js
