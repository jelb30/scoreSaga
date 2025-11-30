# ScoreSaga

ScoreSaga is a fantasy-ready sports companion that brings football and cricket fixtures, authentication, and a modern React + Spring Boot stack together. It ships with seeded demo matches, JWT auth, and a dashboard/home flow tailored for quick access to upcoming games.

## Stack
- **Backend:** Java 17, Spring Boot, Spring Security (JWT), JPA/Hibernate, PostgreSQL
- **Frontend:** React (Vite), Axios, Tailwind styles
- **Build/Tooling:** Maven, npm, Makefile helpers

## Features
- User registration & login (JWT issued by backend; sent as bearer/cookie).
- Protected profile endpoint that returns user details from the DB via the token.
- Seeded dummy fixtures (cricket + football) exposed at `/api/matches`.
- Frontend home with sport tabs, fixture listings, and profile view; profile page pulls live user details.

## Prerequisites
- Java 17+
- Maven (`mvn`)
- Node.js 18+ and npm
- PostgreSQL running locally (defaults: `jdbc:postgresql://localhost:5432/scoreSaga`, user/password `postgres`).

## Quick start
1) **Install frontend deps** (first time):
   ```bash
   cd Frontend && npm install
   ```
2) **Run backend** (from repo root):
   ```bash
   make dev-backend
   ```
3) **Run frontend** (new terminal, repo root):
   ```bash
   make dev-frontend
   ```
4) Open the app at `http://localhost:5173`.

## Useful commands (root)
- `make dev-backend` — start Spring Boot API.
- `make dev-frontend` — start Vite dev server.
- `make test-backend` — run backend tests.
- `make test-frontend` — run frontend tests (if configured).
- `make build-backend` — package backend JAR.
- `make build-frontend` — build frontend assets.
- `make clean-backend` / `make clean-frontend` — clean outputs.

## Backend endpoints
- `POST /api/auth/register` — create account.
- `POST /api/auth/login` — returns JWT (also set as cookie if enabled).
- `GET /api/user/profile` — authenticated user details from DB.
- `GET /api/matches?sport=CRICKET&status=UPCOMING` — list seeded fixtures (also `FOOTBALL`).

## Configuration
Backend config lives in `Backend/src/main/resources/application.properties` (DB URL, credentials, JWT secret/expiry). Adjust to match your environment.

## Notes
- If you prefer Maven Wrapper, add `.mvn/wrapper` and `mvnw`; Makefile currently uses system `mvn`.
- Ensure PostgreSQL is running and accessible before starting the backend to let JPA create tables and seed matches.
