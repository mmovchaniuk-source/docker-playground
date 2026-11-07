# Етап 1: підготовка застосунку
FROM node:22-alpine AS build

WORKDIR /app

COPY server.js .

RUN node --check server.js

# Створюємо каталог даних із правильним власником
RUN mkdir -p /data && chown node:node /data


# Етап 2: фінальний образ
FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=build --chown=node:node /app/server.js .
COPY --from=build --chown=node:node /data /data

USER node

EXPOSE 3000

CMD ["node", "server.js"]
EOF
