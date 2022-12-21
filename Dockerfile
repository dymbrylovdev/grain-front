FROM node:lts-alpine

# Create app folder
RUN mkdir -p /app
WORKDIR /app

# Cache npm dependencies
COPY package.json /app/
COPY yarn.lock /app/
# RUN yarn
RUN npm i --force --legacy-peer-deps

# Copy application files
COPY . /app

EXPOSE 3000

ENV NODE_OPTIONS=--openssl-legacy-provider

CMD ["npm", "run", "serve"]
