# ScoreSaga - Fantasy Sports Platform (Spring Boot + JWT + PostgreSQL + Kafka)

ScoreSaga is an open-source fantasy sports platform inspired by Dream11, built using Java and Spring Boot, with JWT-based authentication, PostgreSQL for data persistence, and Kafka for real-time match data processing. This project is modular, cloud-deployable, and suitable for team collaboration.

---

## Features

- User Registration and Login with JWT
- Secure token-based authentication
- REST APIs for users, matches, and teams
- PostgreSQL integration for persistent storage
- Apache Kafka setup for real-time score processing (upcoming)
- Modular codebase with clear service-controller separation
- Designed for deployment on AWS Free Tier

---

## Tech Stack

| Layer        | Technology        |
|-------------|-------------------|
| Backend      | Java, Spring Boot |
| Security     | Spring Security, JWT |
| Database     | PostgreSQL        |
| Messaging    | Apache Kafka (upcoming) |
| Cloud Ready  | AWS (Free Tier Compatible) |

---

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- PostgreSQL (with a database named `scoresaga`)
- IntelliJ IDEA or preferred IDE
- Postman (for API testing)

---
## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jelb30/scoreSaga.git
cd scoreSaga
```bash

# PostgreSQL Setup for ScoreSaga

This guide will help you configure PostgreSQL locally to work with the ScoreSaga Spring Boot application.

---
## 2. Install PostgreSQL

### macOS (with Homebrew)

```bash
brew install postgresql
```bash
```bash
brew services start postgresql
```bash

```bash
-- Log in as postgres
psql -U postgres
```bash

```bash
-- Create database
CREATE DATABASE scoresaga;
```bash
