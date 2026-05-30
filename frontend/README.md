# IPMP Frontend

Next.js 15 + Tailwind v4 + shadcn/ui + AG Grid + TanStack Query

## Run locally

```bash
# Backend (port 3000)
cd backend
# Set CORS_ORIGIN=http://localhost:3001 in .env
npm run start:dev

# Apply migrations (if needed)
npx prisma migrate deploy
npx prisma generate

# Frontend (port 3001)
cd frontend
npm install
npm run dev
```

Open http://localhost:3001

## Environment

`frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

`backend/.env`:
```
CORS_ORIGIN=http://localhost:3001
```

## Role landing routes

| Role | Landing |
|------|---------|
| ADMIN | `/dashboard` |
| INVENTORY | `/inventory` |
| PROCUREMENT | `/procurement` |
