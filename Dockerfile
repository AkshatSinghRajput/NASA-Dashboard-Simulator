FROM node:lts-alpine3.17

WORKDIR /app

COPY package*.json ./

COPY Client/package*.json Client/
RUN npm run client-install 

COPY Server/package*.json Server/
RUN npm run server-install 

COPY Client/ Client/
RUN npm run build --prefix Client

COPY Server/ Server/
USER node



EXPOSE 4000

CMD ["npm","run","server"]