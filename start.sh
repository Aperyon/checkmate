#! /bin/bash

# Run `$ . ./start.sh` to preserve subshell

source venv/bin/activate
export $(cat code/config/local/vars.env | xargs)
