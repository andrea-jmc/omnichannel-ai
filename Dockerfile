FROM ovarela1/node18.19-alpine3.19wcwa:latest

ARG URL_ENV

ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn 
      
# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Puppeteer v13.5.0 works with Chromium 100.
RUN yarn add puppeteer@13.5.0

WORKDIR /var/www/html

COPY . .

RUN aws ssm get-parameter \
    --region us-east-1 \
    --with-decryption \
    --name $URL_ENV \
    --output text \
    --query 'Parameter.Value' > .env
    
RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
