# ScoreSaga

ScoreSaga is a full-stack sports fixtures platform focused on football and cricket, built with Spring Boot, React, and PostgreSQL.

The project combines secure authentication, automated fixture sync, grouped match dashboards, testing, and deployment-ready backend packaging. It is designed as a strong MVP foundation for a larger sports product.

I built ScoreSaga as both a software project and a passion project. I am a sports enthusiast, I actively play as well, and I closely follow both football and cricket, which is why the product is shaped around real fixture consumption and a clean fan-first experience.

## What ScoreSaga Does

- Secure user registration and login with JWT-based authentication
- Protected user profile endpoint
- Automated football fixture sync from `football-data.org`
- Automated mock cricket fixture sync with league-correct team generation
- Database upsert pipeline for leagues, teams, and matches
- Grouped sports dashboard UI by league
- H2-backed integration test baseline for backend safety
- Multi-stage Docker packaging for deployment

## Current Product Scope

ScoreSaga is currently a production-ready sports fixtures MVP, not yet a full fantasy contest platform.

It currently includes:
- Auth and protected user flows
- Football and cricket fixture ingestion
- League-grouped match dashboard
- Profile view
- Database-backed sync architecture
- Deployment-ready backend containerization

Planned future scope can include:
- saved fixtures and favorites
- alerts and notifications
- fantasy squad builder
- leaderboards and contest mechanics

## Tech Stack

### Backend
- Java 17
- Spring Boot 3
- Spring Security
- Spring Data JPA / Hibernate
- PostgreSQL
- H2 for tests
- Maven

### Frontend
- React
- Vite
- Axios
- Tailwind CSS

### DevOps / Delivery
- Docker (multi-stage backend build)
- Environment-based configuration
- H2 integration tests for safe local and CI execution

## Architecture Overview

### Backend
- `AuthController` handles register, login, and logout flows.
- `FixtureSyncService` runs startup and scheduled sync jobs.
- `FootballApiClientImpl` fetches real football data from `football-data.org`.
- `MockCricketApiClientImpl` generates realistic cricket data with strict league-to-team mapping.
- `Match`, `League`, and `Team` are persisted in PostgreSQL using external IDs for upserts.

### Frontend
- `Dashboard` is the public landing page.
- `Login` and `Register` handle auth flows.
- `Home` shows grouped fixtures by league with sport tabs.
- `Profile` shows the authenticated user profile.

## Key Features

### Authentication
- Register a new account
- Log in and receive JWT auth
- Secure cookie-based logout
- Protected profile route

### Fixture Sync
- Football sync restricted to major European competitions:
  - Premier League
  - Champions League
  - La Liga
  - Serie A
  - Bundesliga
  - Ligue 1
- Cricket sync via a mock provider with realistic league separation:
  - `IPL` only uses franchise teams
  - `ICC Champions Cup` only uses international teams

### Data Pipeline
- Scheduled sync runs every 12 hours
- Startup sync can populate the database immediately
- Upsert-safe persistence prevents duplicate rows
- Match payload returned to the frontend includes:
  - `id`
  - `leagueName`
  - `homeTeam`
  - `awayTeam`
  - `homeScore`
  - `awayScore`
  - `startTime`
  - `status`

### Testing
- H2 in-memory test profile
- Auth integration tests
- Fixture sync upsert tests
- Safe separation from production Postgres and live external APIs

## Repository Structure

```text
scoreSaga/
├── Backend/
│   ├── src/main/java/com/scoresaga/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── util/
│   ├── src/main/resources/
│   ├── src/test/
│   ├── Dockerfile
│   └── pom.xml
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   └── pages/
│   └── package.json
├── Makefile
└── README.md
```

## Local Setup

### Prerequisites
- Java 17+
- Maven
- Node.js 18+
- npm
- PostgreSQL

### Backend Environment

Create a local backend env file:

```bash
cp Backend/.env.example Backend/.env
```

Fill in the required values in `Backend/.env`:

```env
SCORESAGA_DB_URL=jdbc:postgresql://localhost:5432/scoreSaga
SCORESAGA_DB_USERNAME=postgres
SCORESAGA_DB_PASSWORD=postgres
SERVER_PORT=8080
JWT_SECRET=your-long-random-secret
JWT_EXPIRATION_MS=3600000
FOOTBALL_API_BASE_URL=https://api.football-data.org/v4
FOOTBALL_API_KEY=your-api-key
CRICKET_API_BASE_URL=https://example-cricket-api.com
CRICKET_API_KEY=
```

### Run Locally

Backend:

```bash
cd Backend
mvn spring-boot:run
```

Frontend:

```bash
cd Frontend
npm install
npm run dev
```

Or from the repo root:

```bash
make dev-backend
make dev-frontend
```

Frontend runs at:

```text
http://localhost:5173
```

Backend runs at:

```text
http://localhost:8080
```

## Useful Commands

From the repo root:

```bash
make dev-backend
make dev-frontend
make test-backend
make build-backend
make build-frontend
make clean-backend
```

Backend directly:

```bash
cd Backend
mvn test
mvn -DskipTests clean package
```

Frontend directly:

```bash
cd Frontend
npm run dev
npm run build
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### User
- `GET /api/user/profile`

### Fixtures
- `GET /api/matches?sport=CRICKET&status=UPCOMING`
- `GET /api/matches?sport=FOOTBALL&status=UPCOMING`

## Testing

Backend tests run against an isolated H2 database using the `test` profile.

Run the backend test suite:

```bash
cd Backend
mvn test
```

Current backend test coverage includes:
- auth registration
- auth login
- secure logout cookie behavior
- fixture sync upsert behavior

## Docker

A multi-stage backend Dockerfile is available at:

[`Backend/Dockerfile`](Backend/Dockerfile)

Build the backend image:

```bash
docker build -t scoresaga-backend ./Backend
```

Run it:

```bash
docker run --rm -p 8080:8080 \
  -e SCORESAGA_DB_URL=jdbc:postgresql://host:5432/scoreSaga \
  -e SCORESAGA_DB_USERNAME=postgres \
  -e SCORESAGA_DB_PASSWORD=postgres \
  -e JWT_SECRET=your-secret \
  -e FOOTBALL_API_KEY=your-api-key \
  -e FRONTEND_URL=https://your-frontend-domain.com \
  scoresaga-backend
```

## Deployment

The backend is ready to deploy to:
- Railway
- Render
- Fly.io

General deployment pattern:
1. Build and deploy the backend container from `Backend/`
2. Provision a PostgreSQL database
3. Inject database credentials as environment variables
4. Set `FRONTEND_URL` to your deployed frontend domain
5. Set `JWT_SECRET` and API keys in the platform secret manager

Required production env vars:
- `SCORESAGA_DB_URL`
- `SCORESAGA_DB_USERNAME`
- `SCORESAGA_DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `FOOTBALL_API_KEY`
- `FRONTEND_URL`

## Branch Workflow

Active development is currently happening on:

```text
dev_jelb
```

Recommended flow:
1. Push all working changes to `dev_jelb`
2. Review and verify the branch
3. Open a PR from `dev_jelb` into `main`
4. Merge after final validation

## Commit Message Recommendation

Do not use a vague message like `completed the entire project`. It is not a good engineering commit message.

Use this instead:

```text
feat: complete ScoreSaga MVP with auth, fixture sync, testing, docker, and production-ready backend setup
```

If you want a slightly shorter version:

```text
feat: finalize ScoreSaga MVP and production backend foundation
```

## Why This Project Matters To Me

ScoreSaga is not just a technical exercise for me. I genuinely follow and play sports, especially football and cricket, so I wanted to build something that reflects how real fans experience fixtures, leagues, and match days. That personal connection is a big part of why I care about the product quality, structure, and long-term potential.

## Roadmap

- improve frontend match details and live score presentation
- add favorite teams and saved fixtures
- add notifications / reminders
- expand football and cricket coverage
- build fantasy-style squad and leaderboard features
- add CI/CD and production monitoring

## License

This repository currently does not include a license file.
