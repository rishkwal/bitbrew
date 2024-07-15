#!/bin/bash
set -e

cp /etc/bitcoin.conf "$BITCOIN_DATA/bitcoin.conf"
chown -R bitcoin:bitcoin ${BITCOIN_DATA} \
    && chmod 755 ${BITCOIN_DATA} \
    && chmod 600 ${BITCOIN_DATA}/bitcoin.conf

exec "$@"