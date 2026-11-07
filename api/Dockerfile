# Етап 1: підготовка застосунку
FROM node:22-alpine AS build

WORKDIR /app

COPY server.js .

RUN node --check server.js

# Готуємо каталог даних для non-root користувача Distroless
RUN mkdir -p /data && chown 65532:65532 /data


# Етап 2: мінімальний runtime
FROM gcr.io/distroless/nodejs22-debian13:nonroot

WORKDIR /app

COPY --from=build --chown=65532:65532 /app/server.js .
COPY --from=build --chown=65532:65532 /data /data

USER 65532:65532

EXPOSE 3000

CMD ["server.js"]
