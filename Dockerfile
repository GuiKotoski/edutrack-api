FROM node:22-bookworm-slim AS base

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS build

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --include=dev \
  && npx prisma generate

COPY src ./src
COPY docs/openapi.json ./docs/openapi.json

FROM base AS runtime

COPY docker/package.runtime.json ./package.json
COPY docker/package.runtime-lock.json ./package-lock.json
RUN npm ci --omit=dev --ignore-scripts

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY src ./src
COPY prisma/schema.prisma ./prisma/schema.prisma
COPY prisma/migrations ./prisma/migrations
COPY docs/openapi.json ./docs/openapi.json

ENV NODE_ENV=production
EXPOSE 3000
USER node

CMD ["npm", "start"]
