#!/bin/sh

# If a command fails then the deploy stops
set -e

git submodule update --recursive --init

git submodule update --recursive --remote
