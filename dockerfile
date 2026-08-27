#build the frontend [dist folder]
#copy the dist folder content in backend/public folder

FROM node:20-alpine as frontend-builder

COPY ./Fronted /app

WORKDIR /app

RUN npm install

RUN npm run build

