# Docker Playground

Тестовий проект для закріплення теоретичних знань і практики роботи з Docker та Docker Compose. 
Він складається зі статичної вебсторінки на Nginx та Node.js API з лічильником відвідувань.

## Архітектура

Проєкт складається зі статичної вебсторінки на Nginx та Node.js API з лічильником відвідувань.
Дані лічильника зберігаються в Docker volume, що дозволяє зберігати їх після перезапуску контейнера.

## Docker Hub images

- Web: https://hub.docker.com/r/marianamovchaniuk/docker-playground-web
- API: https://hub.docker.com/r/marianamovchaniuk/docker-playground-api

## Перевірене середовище

- Docker Engine: 29.9.2
- Docker Compose: 5.6.1
- Node.js: 22
- API runtime: Distroless Node.js 22 Debian 13
- API image: `v3`
- Web image: `v1`


## Запуск проекту

Клонуйте репозиторій і перейдіть до його каталогу:
```
git clone https://github.com/mmovchaniuk-source/docker-playground.git
cd docker-playground
```
Завантажте обидва образи та запустіть контейнери:
```
docker compose pull
docker compose up -d
```
Перевірте стан сервісів:
```
docker compose ps
```
### Доступ до застосунку

| Компонент | Адреса | Призначення |
|---|---|---|
| Web | `http://localhost:8083` | Статична вебсторінка |
| API health check | `http://127.0.0.1:3001/health` | Перевірка стану API |
| API visits | `http://127.0.0.1:3001/visits` | Отримання та збільшення лічильника |

Адреси з localhost та 127.0.0.1 призначені для перевірки на Docker-хості. 
Якщо Docker працює на віддаленому сервері, використовуйте SSH-підключення або виконуйте curl безпосередньо на сервері.

## API endpoints

### GET /health

Перевіряє доступність API.
Приклад відповіді:
```
{
  "status": "ok"
}
```
### GET /visits

Збільшує лічильник відвідувань на одиницю та повертає його поточне значення.
Приклад відповіді:
```
{
  "visits": 1
}
```
Кожен запит до /visits збільшує лічильник. Значення зберігається у файлі /data/visits.txt.
Додатково протестувала - значення зберігається при перезапуску або повторному створенні контейнера за умови використання того самого volume.

## Docker Compose

`compose.yaml` визначає два сервіси:

- `web` — Nginx;
- `api` — Node.js API.

Compose створює спільну bridge-мережу. Контейнери можуть взаємодіяти за іменами сервісів, наприклад API доступний у мережі за адресою `http://api:3000`.

## Порти

- `8083:8080` — вебсервер доступний на Docker-хості через порт 8083.
- `127.0.0.1:3001:3000` — API доступний лише локально на Docker-хості через порт 3001.

Порт API не публікується для зовнішніх підключень.

## Persistent storage

Compose створює іменований volume app-data, у якому зберігається лічильник відвідувань API.

Дані зберігаються після перезапуску або пересоздання контейнера, якщо використовується той самий volume.

Переглянути volume:
```
docker volume ls
docker volume inspect docker-playground_app-data
```
Перевірити збереження даних:
```
curl http://127.0.0.1:3001/visits
docker compose restart api
curl http://127.0.0.1:3001/visits
```
## Версіонування та rollback

API доступний у версіях v1, v2 та v3 на Docker Hub. 
Поточна версія v3 використовує Distroless runtime.
Для переходу на іншу версію змініть тег образу в compose.yaml та застосуйте конфігурацію:
```
docker compose up -d api
```
При переході між версіями з різними UID необхідно враховувати права доступу до persistent volume.

## Локальне збирання образів

Зібрати API:
```
docker build -t docker-playground-api:v3 ./api
```
Зібрати Web:
```
docker build -t docker-playground-web:v1 .
```
Зібрати Web із non-root образом:
```
docker build -f Dockerfile.nonroot -t docker-playground-web:nonroot .
```
API використовує multi-stage build: перевірка коду виконується на Node.js Alpine, а застосунок запускається в Distroless Node.js Debian 13.
