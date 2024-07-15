FROM debian:bullseye-slim

ARG UID=1000
ARG GID=1000
ENV BITCOIN_VERSION=27.0
ENV BITCOIN_DATA=/home/bitcoin/.bitcoin
ENV PATH=/opt/bitcoin-${BITCOIN_VERSION}/bin:$PATH

# Install dependencies and create bitcoin user
RUN apt-get update && apt-get install -y curl gnupg gosu \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && groupadd -g ${GID} bitcoin \
    && useradd -u ${UID} -g bitcoin -s /bin/bash -m -d /home/bitcoin bitcoin

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

VOLUME ["/home/bitcoin/.bitcoin"]
EXPOSE 18443 18444

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER bitcoin
WORKDIR /home/bitcoin

ENTRYPOINT ["/entrypoint.sh"]
CMD ["bitcoind", "-regtest"]