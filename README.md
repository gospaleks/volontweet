# VolonTweet

## Dev setup

### Start PostgreSQL (Docker)

- Optionally create a local `.env` from `.env.example` and adjust credentials.
- Start DB:
  - `docker compose up -d`
- Stop DB:
  - `docker compose down`

Connection defaults:

- Host: `localhost`
- Port: `5432`
- Database: `volontweet`
- User: `postgres`
- Password: `postgres`

### Run backend locally

- `cd backend`
- `npm install`
- `npm run start:dev`

### Run frontend locally

- `cd frontend`
- `npm install`
- `npm run dev`
