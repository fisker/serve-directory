#!/usr/bin/env bash

for version in 11 10 9 8 7 6 5 4 0.10 0.8
do
  nvm install $version
  nvm use $version
  node -v
  npm run test:js
done
