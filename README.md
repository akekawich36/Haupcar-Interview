# Haupcar Interview

Back office for cars, brands, models.

- `api/` - Express + Sequelize + PostgreSQL
- `app/` - React + Vite + TanStack Router + shadcn/ui
- `haupcar-api-document/` - Bruno API docs

## Setup

```bash
(cd api && pnpm install && cp .env.example .env)
(cd app && pnpm install && cp .env.example .env)
make dev-db                 # PostgreSQL in Docker, port 5432
(cd api && pnpm dev)        # creates tables, Ctrl + C after "Server is running"
(cd api && pnpm db:seed)    # admin user, brands, models
```

## Start

```bash
make dev
```

- Web: http://localhost:3000
- API: http://localhost:8000/api
