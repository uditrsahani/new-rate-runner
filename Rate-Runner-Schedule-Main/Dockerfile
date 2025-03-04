# Stage 0
FROM node:14.16.0-alpine3.13 as build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 1
FROM node:14.16.0-alpine3.10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY --from=build-stage /usr/src/app/dist ./
RUN mkdir ./upload
RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime
RUN echo "Asia/Bangkok" >  /etc/timezone
RUN apk del tzdata
CMD [ "node", "index.js" ]
