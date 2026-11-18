FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --include=dev \
  && npx prisma generate

COPY src ./src
COPY docs/openapi.json ./docs/openapi.json

ENV NODE_ENV=production
EXPOSE 3000
USER node

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
