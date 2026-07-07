# Builder

Full-stack form builder workspace with separate frontend and backend apps.

## Project Structure

```text
Builder/
  Backend/    Express + TypeScript API, database scripts, server utilities
  Frontend/   React + Vite client
```

## Backend

```bash
cd Backend
npm run dev
```

Useful commands:

```bash
npm run build
npm run seed
npm start
```

The backend loads environment variables from `Backend/.env` and defaults to port `5000`.

## Frontend

```bash
cd Frontend
npm run dev
```

Useful commands:

```bash
npm run build
npm run preview
```
