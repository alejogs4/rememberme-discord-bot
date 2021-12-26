FROM node:16-alpine as base

WORKDIR /usr/src/app
COPY package*.json ./

FROM base as e2e
RUN npm ci
COPY . .
CMD npm run test:e2e

FROM base as prod
RUN npm ci --production
COPY . .
CMD [ "npm", "run", "start" ]
