FROM ovarela1/node18.19-alpine3.19wcwa:latest

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
      
# Set the working directory
WORKDIR /dist

# Copy package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application source
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
