FROM node:lts-alpine

# Create app folder
RUN mkdir -p /app
WORKDIR /app

# Cache npm dependencies
COPY package.json /app/

RUN npm i --legacy-peer-deps --force
RUN yarn

# Copy application files
COPY . /app

EXPOSE 3000

CMD ["yarn", "run", "serve"]
