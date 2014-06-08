#!/bin/bash
if [[ "attach" == "$1" ]]; then
	screen -m -S meteor ./start.sh
else
	screen -d -m -S meteor ./start.sh
fi
