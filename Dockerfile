FROM node:16-slim

# Install necessary dependencies for running Puppeteer
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libpango-1.0-0 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Puppeteer and Chromium dependencies
RUN apt-get update && apt-get install -yq libgconf-2-4 \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Switch to the official Puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest
      
WORKDIR /app

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY package*.json ./

RUN npm install

RUN chown -R appuser:appgroup /app

USER appuser

COPY --chown=appuser:appgroup . .

EXPOSE 3000

CMD ["npm", "build"]
CMD ["npm", "start"]
