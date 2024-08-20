FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm config rm proxy
RUN npm config rm https-proxy
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]