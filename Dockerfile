FROM node:22.13.1-slim

ENV TZ="Europe/London"

USER root

RUN apt-get update -qq \
    && apt-get install -qqy \
    curl \
    procps \
    zip \
    openjdk-17-jre-headless

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && unzip awscliv2.zip \
    && ./aws/install

WORKDIR /app

COPY . .
RUN npm install
# Install Playwright browsers after npm install to ensure version compatibility
RUN npx playwright install --with-deps chromium

# BrowserStackLocal is pre-installed so the SDK doesn't download it at runtime through the CDP proxy.
# BrowserStack doesn't publish a checksum for it. Pass BROWSERSTACK_LOCAL_SHA256 at build time to enforce one.
ARG BROWSERSTACK_LOCAL_SHA256=""
RUN mkdir -p /root/.browserstack \
    && curl -fsSL https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip -o /tmp/bs.zip \
    && if [ -n "$BROWSERSTACK_LOCAL_SHA256" ]; then echo "$BROWSERSTACK_LOCAL_SHA256  /tmp/bs.zip" | sha256sum -c -; fi \
    && unzip /tmp/bs.zip -d /root/.browserstack \
    && chmod +x /root/.browserstack/BrowserStackLocal \
    && rm /tmp/bs.zip

ENTRYPOINT [ "./entrypoint.sh" ]

# This is downloading the linux amd64 aws cli. For M1 macs build and run with the --platform=linux/amd64 argument. eg docker build . --platform=linux/amd64
