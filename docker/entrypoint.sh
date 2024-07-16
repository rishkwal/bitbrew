#!/bin/bash
set -e

    echo $(whoami) 
    cp /etc/bitcoin.conf "$BITCOIN_DATA/bitcoin.conf" \
    && mkdir /root/.bitcoin \
    && cp /etc/bitcoin.conf /root/.bitcoin/bitcoin.conf \
    && chmod 600 ${BITCOIN_DATA}/bitcoin.conf

exec "$@"