# Health-AI

AI-powered support system for children with special needs using MedGemma + HAI-DEF.

## Quick Start

```bash
# Start with Docker
./start.sh

# Or manually
docker-compose up -d
```

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Features

- Mood & behavior tracking
- AI-powered insights
- Daily routines & schedules
- Focus activities & games
- Meal planning
- Family coordination
- Progress analytics

## Tech Stack

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Backend**: Rust + Actix-Web
- **Database**: PostgreSQL + Redis
- **AI**: MedGemma + HAI-DEF

## Development

```bash
# Frontend
pnpm install
pnpm dev

# Backend
cd backend
cargo run

# Database
docker-compose up -d postgres redis
psql -d health_ai -f backend/migrations/init.sql
```

## License

MIT
