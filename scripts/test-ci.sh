#!/usr/bin/env bash

source $NVM_DIR/nvm.sh

echo $NVM_DIR
nvm --version

for version in 11 10 9 8 7 6 5 4 0.10 0.8
do
  unset npm_config_prefix
  nvm install $version
  nvm use $version
  node -v
  npm run test:js
done
