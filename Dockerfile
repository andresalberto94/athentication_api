FROM node:16

WORKDIR /api

COPY package.json /api

RUN npm install

COPY . /api

EXPOSE 3001

