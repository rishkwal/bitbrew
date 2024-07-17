FROM debian:bullseye-slim

ENV BITCOIN_VERSION=27.0
ENV PATH=/opt/bitcoin-${BITCOIN_VERSION}/bin:$PATH

# Install dependencies
RUN apt-get update && apt-get install -y curl gnupg \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Download and install Bitcoin Core
ARG TARGETPLATFORM
RUN set -ex \
    && if [ "${TARGETPLATFORM}" = "linux/amd64" ]; then export TARGETPLATFORM=x86_64-linux-gnu; fi \
    && if [ "${TARGETPLATFORM}" = "linux/arm64" ]; then export TARGETPLATFORM=aarch64-linux-gnu; fi \
    && if [ "${TARGETPLATFORM}" = "linux/arm/v7" ]; then export TARGETPLATFORM=arm-linux-gnueabihf; fi \
    && curl -SLO https://bitcoincore.org/bin/bitcoin-core-${BITCOIN_VERSION}/bitcoin-${BITCOIN_VERSION}-${TARGETPLATFORM}.tar.gz \
    && curl -SLO https://bitcoincore.org/bin/bitcoin-core-${BITCOIN_VERSION}/SHA256SUMS \
    && sha256sum --ignore-missing --check SHA256SUMS \
    && tar -xzf *.tar.gz -C /opt \
    && rm *.tar.gz SHA256SUMS \
    && rm -rf /opt/bitcoin-${BITCOIN_VERSION}/bin/bitcoin-qt

# Copy Bitcoin configuration
COPY bitcoin.conf /etc/bitcoin.conf

RUN mkdir -p /root/.bitcoin
EXPOSE 18443 18444

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bitcoind", "-regtest"]