FROM node:lts-alpine

# Create app folder
RUN mkdir -p /app
WORKDIR /app

# Cache npm dependencies
COPY package.json /app/
# COPY yarn.lock /app/
RUN npm i
RUN yarn

# Copy application files
COPY . /app

EXPOSE 3000

ENV NODE_OPTIONS=--openssl-legacy-provider

CMD ["yarn", "run", "server"]
