#!/usr/bin/env bash

electronBinPath="../node_modules/.bin"
electronPath="`cd "${electronBinPath}"; pwd`/electron"
echo "${electronPath}"

electronPath $* | bunyan --color
exit ${PIPESTATUS[0]}
