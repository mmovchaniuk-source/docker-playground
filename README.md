# Docker Playground

Це мій тестовий проект для засвоєння теоретичних знань та використання їх на практиці у засвоєнні Docker і Docker Compose. 

Він складається зі статичної вебсторінки на Nginx та Node.js API з лічильником відвідувань.

## Архітектура

- **Web:** Nginx, працює від непривілейованого користувача.
- **API:** Node.js HTTP server, multi-stage Docker build, запуск від користувача `node`.
- **Network:** стандартна bridge-мережа Docker Compose.
- **Persistent storage:** іменований volume `app-data`, змонтований у `/data` контейнера API.

## Docker Hub images

- Web: https://hub.docker.com/r/marianamovchaniuk/docker-playground-web
- API: https://hub.docker.com/r/marianamovchaniuk/docker-playground-api

## Вимоги

- Docker Engine
- Docker Compose

## Запуск

```bash
docker compose pull
docker compose up -d


