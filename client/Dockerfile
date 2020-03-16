FROM node:dubnium-jessie as builder

WORKDIR "/app"

COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "prod"]

FROM nginx
EXPOSE 2000
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dest /usr/share/nginx/html