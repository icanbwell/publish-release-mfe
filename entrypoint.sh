#!/bin/bash

version=$(jq .version package.json | sed 's/"//g')
echo "::set-output name=version::$version"

yarn install --frozen-lockfile && yarn publish
