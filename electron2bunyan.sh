#!/usr/bin/env bash

node_modules/.bin/electron $@ 2>&1 | bunyan --color
exit ${PIPESTATUS[0]}
