# 🚀 Crypto Price Tracker

**Crypto Price Tracker**, Binance API üzerinden kripto para fiyatlarını çeken, Redis cache ve PostgreSQL veritabanına kaydeden bir mikroservis uygulamasıdır. Docker Compose ile kolayca çalıştırılabilir ve frontend tarafında WebSocket ile canlı fiyatlar ve grafikler sunar.

![Live Chart](./screenshot.png)

---

## 1️⃣ Projenin Amacı

- Binance API’den kripto fiyatlarını çekmek  
- Redis ile cacheleyerek hızlı erişim sağlamak  
- PostgreSQL’e fiyat geçmişini loglamak  
- Docker Compose ile tüm servisleri ayağa kaldırmak  
- Scheduler container ile fiyatları belirli aralıklarla çekmek  
- Frontend’de WebSocket ile canlı fiyat ve grafik göstermek  

---

## 2️⃣ Sistem Mimarisi ve Servisler

### 2.1 Backend API
- Node.js & NestJS tabanlı  
- Fiyatları çekip PostgreSQL ve Redis’e kaydeder  
- `/prices` endpoint ile son fiyatları JSON olarak döner  
- WebSocket ile frontend’e canlı veri gönderir  

### 2.2 Database
- PostgreSQL (Docker container)  
- `price_logs` tablosu:  
  | Kolon | Tip | Açıklama |
  |-------|-----|----------|
  | id | SERIAL PRIMARY KEY | Tekil ID |
  | symbol | VARCHAR | Kripto para sembolü (BTCUSDT) |
  | price | DECIMAL | Fiyat |
  | timestamp | TIMESTAMP | Veri çekilme zamanı |

### 2.3 Cache
- Redis (Docker container)  
- Son fiyatların hızlı erişimi için kullanılır  

### 2.4 Scheduler / Worker
- Fiyatları belirli aralıklarla çekmek için ayrı container  
- Cron-job benzeri işleyişle otomatik güncelleme sağlar  

---

## 3️⃣ Docker Compose Yapısı

```yaml
version: "3.9"
services:
  db:
    image: postgres:16
    container_name: crypto-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: cryptodb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    container_name: crypto-redis
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    container_name: crypto-backend
    env_file: ./backend/.env
    depends_on:
      - db
      - redis
    ports:
      - "4000:4000"

  worker:
    build: ./worker
    container_name: crypto-worker
    env_file: ./worker/.env
    depends_on:
      - db
      - redis

volumes:
  pgdata:
```
## 4️⃣ .env Örnek

**backend/.env & worker/.env**

```dotenv
DATABASE_URL="postgresql://postgres:password@db:5432/cryptodb"
REDIS_HOST="redis"
REDIS_PORT=6379
BINANCE_API_URL="https://api.binance.com/api/v3/ticker/price"
SCHEDULE_INTERVAL=10   # saniye cinsinden
```

## 5️⃣ Kurulum & Çalıştırma

### Repo’yu klonlayın:
```bash
git clone <repo-url>
cd <repo-folder>
```

Docker Compose ile servisleri ayağa kaldırın:
```bash
docker-compose up --build
```

Backend API’ye erişim:
```bash
http://localhost:4000/prices
```

Frontend’i açın ve canlı fiyatları, live chart’ı görüntüleyin:
```
http://localhost:4173
```

## 6️⃣ Teknolojiler

Backend: Node.js, NestJS

Database: PostgreSQL

Cache: Redis

Messaging / Scheduler: Worker container, cron-like

Frontend: WebSocket, Live Chart

Containerization: Docker, Docker Compose

## 7️⃣ Özellikler

- Fiyatların belirli aralıklarla otomatik güncellenmesi

- Redis cache ile hızlı erişim

- WebSocket ile frontend’e canlı veri akışı

- Live chart ile grafik gösterimi


⚡ Not: ![Live Chart](./screenshot.png) kısmındaki görseli repo köküne screenshot.png olarak kaydedersen Markdown içinde gösterilecektir.
