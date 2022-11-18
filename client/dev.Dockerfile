FROM node:lts-alpine

RUN mkdir /app
WORKDIR /app

COPY *.json ./

RUN npm install

COPY public public
COPY src src

CMD npm start
