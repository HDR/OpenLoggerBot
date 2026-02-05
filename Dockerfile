# syntax=docker/dockerfile:1
FROM node:24-trixie

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "index.js"]