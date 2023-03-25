FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

EXPOSE 3000

RUN npm ci

COPY . .

RUN npm run build

CMD ["node", "dist/main"]