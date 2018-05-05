echo off

SET parent=%~dp0

"%parent%..\node_modules\.bin\electron" %* | "%parent%..\node_modules\.bin\bunyan" --color -o short

