FROM node:lts-alpine

RUN mkdir /app
RUN mkdir /tmp/files
WORKDIR /app
COPY *.json ./
COPY .env.dist .env
COPY src src

ENV WEBSITE_URL=http://localhost:3000

RUN npm install

CMD npm start