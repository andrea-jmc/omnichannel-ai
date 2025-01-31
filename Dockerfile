FROM node:22

# Install necessary dependencies for running Puppeteer
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Puppeteer and Chromium dependencies
RUN apt-get update && apt-get install -yq libgconf-2-4 \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Switch to the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest
      
WORKDIR /app

COPY . .

RUN chown -R node:node /app

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "build"]
CMD ["npm", "start"]
