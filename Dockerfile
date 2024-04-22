FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE ${PORT}

COPY . .

CMD ["npm", "start"]
