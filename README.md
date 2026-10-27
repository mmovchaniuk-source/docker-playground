# Docker Playground

Тестовий проект для закріплення теоретичних знань і практики роботи з Docker та Docker Compose. 
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

- Встановлений Docker Engine.
- Плагін Docker Compose.
- Доступ до Docker Hub для завантаження опублікованих образів.

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

Файл compose.yaml визначає два сервіси:
web - вебсервер Nginx;
api - Node.js API.

Compose створює спільну bridge-мережу. 
Контейнери можуть звертатися один до одного за іменами сервісів. 
Наприклад, API доступний іншим контейнерам цієї мережі за адресою http://api:3000.

## Порти

8083:8080 - порт вебсервера; доступний на мережевих інтерфейсах Docker-хоста.
 - 8083 - порт cервера, через який можна звернутися до вебсторінки.
 - 8080 - порт усередині контейнера, на якому працює Nginx.

127.0.0.1:3001:3000 - порт API доступний лише локально на Docker-хості.
 - 127.0.0.1 - API доступний через локально на самому сервері.
 - 3001 - порт сервера.
 - 3000 - порт усередині контейнера API.

expose: 3000 - декларує порт API для взаємодії всередині Docker-мережі; сам по собі не публікує його на хості.

## Зберігання даних
Compose створює іменований volume app-data, який Docker монтує в /data контейнера API.
Переглянути volume:
```
docker volume ls
docker volume inspect docker-playground_app-data
```
Перевірка збереження даних:
```
curl http://127.0.0.1:3001/visits
docker compose restart api
curl http://127.0.0.1:3001/visits
```
Після перезапуску значення лічильника має продовжитися, а не починатися заново.

## Локальне збирання образів

```
docker build -t docker-playground-api:v1 ./api
docker build -f Dockerfile.nonroot -t docker-playground:nonroot .
```

API використовує multi-stage build, а його дані зберігаються в іменованому Docker volume.

