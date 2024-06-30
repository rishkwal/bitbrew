#!/bin/bash
set -e

# Allow the container to be started with `--user`
if [ "$(id -u)" = "0" ]; then
  chown -R bitcoin:bitcoin "$BITCOIN_DATA"
  exec gosu bitcoin "$0" "$@"
fi

# Ensure regtest mode is set
if [[ "$*" == *"bitcoind"* ]] && [[ "$*" != *"-regtest"* ]]; then
  set -- "$@" -regtest
fi

exec "$@"