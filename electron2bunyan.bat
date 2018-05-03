@echo off
"node_modules/.bin/electron" %* | "node_modules/.bin/bunyan" --color -o short
