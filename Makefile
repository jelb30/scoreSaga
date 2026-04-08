# Makefile for ScoreSaga (root)

.PHONY: help backend frontend dev dev-backend dev-frontend test-backend test-frontend clean-backend clean-frontend build-backend build-frontend

help:
	@echo "Available targets:"
	@echo "  dev             - run backend and frontend concurrently (use separate terminals)"
	@echo "  dev-backend     - run Spring Boot backend"
	@echo "  dev-frontend    - run Vite frontend"
	@echo "  test-backend    - run backend tests"
	@echo "  test-frontend   - run frontend tests (if configured)"
	@echo "  build-backend   - package backend"
	@echo "  build-frontend  - build frontend"
	@echo "  clean-backend   - clean backend build"
	@echo "  clean-frontend  - clean frontend build"

dev: dev-backend

dev-backend:
	cd Backend && mvn spring-boot:run

dev-frontend:
	cd Frontend && npm run dev

test-backend:
	cd Backend && mvn test

test-frontend:
	cd Frontend && npm test

build-backend:
	cd Backend && mvn clean package

build-frontend:
	cd Frontend && npm run build

clean-backend:
	cd Backend && mvn clean

clean-frontend:
	cd Frontend && npm run clean || true
