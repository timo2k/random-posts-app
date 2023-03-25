# ---- Base Node ----
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./

# ---- Builder ----
FROM base AS builder

RUN npm ci

COPY . .

RUN npm run build

# ---- Prisma ----
FROM builder AS prisma-builder

RUN npm install --production

RUN npx prisma generate

# ---- Production ----
FROM node:18-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --from=prisma-builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=prisma-builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 3000

CMD ["node", "dist/main"]