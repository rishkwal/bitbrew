#!/bin/bash
set -e

# Allow the container to be started with `--user`
if [ "$(id -u)" = "0" ]; then
  chown -R bitcoin:bitcoin "$BITCOIN_DATA"
  exec gosu bitcoin "$0" "$@"
fi

cp /etc/bitcoin.conf "$BITCOIN_DATA/bitcoin.conf"
chown -R bitcoin:bitcoin ${BITCOIN_DATA} \
    && chmod 755 ${BITCOIN_DATA} \
    && chmod 600 ${BITCOIN_DATA}/bitcoin.conf

# Ensure regtest mode is set
if [[ "$*" == *"bitcoind"* ]] && [[ "$*" != *"-regtest"* ]]; then
  set -- "$@" -regtest
fi

exec "$@"