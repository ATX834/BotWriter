FROM buildkite/puppeteer:latest
  
RUN mkdir /app
WORKDIR /app

COPY *.json ./

RUN npm install

ENV PORT 8000

COPY index.js index.js

EXPOSE 8000

# CMD npm run server
CMD npm start