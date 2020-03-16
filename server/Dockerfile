FROM node:dubnium-jessie as builder

WORKDIR "/app"

COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "start-prod"]