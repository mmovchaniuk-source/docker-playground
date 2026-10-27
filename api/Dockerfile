# Етап 1: підготовка застосунку
FROM node:22-alpine AS build

WORKDIR /app

COPY server.js .

RUN node --check server.js


# Етап 2: фінальний образ
FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=build --chown=node:node /app/server.js .

USER node

EXPOSE 3000

CMD ["node", "server.js"]
