---
title: "Docker Compose Templates Every Developer Needs"
description: "Ready-to-use Docker Compose templates for databases, reverse proxies, monitoring stacks, and development environments. Copy, customize, and run."
date: 2026-04-26
tags: [docker, devops, templates]
layout: article.njk
---

Docker Compose turns a complex multi-service setup from a page of shell commands into a single declarative file. But most developers reinvent the compose file every time they start a new project. These templates cover the configurations you will use most often, with comments explaining every line so you can customize them without guessing.

## PostgreSQL with Persistent Storage

The most common service in any backend project. This template includes a named volume for data persistence, health checks, and a sensible default configuration:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: project-postgres
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

The health check is essential. Without it, your application might try to connect before PostgreSQL is ready, causing startup failures. The `pg_isready` command returns success only when the database is accepting connections, making it a reliable readiness probe.

The Alpine variant of the PostgreSQL image is roughly 80MB smaller than the standard image and starts faster. For development, there is no downside.

## PostgreSQL with pgAdmin

When you need a visual database browser alongside PostgreSQL:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: project-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres

volumes:
  postgres_data:
```

Access pgAdmin at `http://localhost:5050`. When adding a server connection, use `postgres` as the hostname -- Docker's internal DNS resolves service names automatically.

## Redis with Persistence

Redis is the standard choice for caching, session storage, and message queues. This template enables append-only file persistence so your data survives container restarts:

```yaml
services:
  redis:
    image: redis:7-alpine
    container_name: project-redis
    command: redis-server --appendonly yes --requirepass devpassword
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

The `--appendonly yes` flag tells Redis to write every write operation to a log file. This provides durability without the overhead of full snapshot-based persistence. For a development environment, it is the best balance between safety and performance.

## Full-Stack Development Environment

This template provides a complete backend stack -- PostgreSQL, Redis, and a reverse proxy -- for a typical web application:

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mailpit:
    image: axllent/mailpit
    container_name: project-mailpit
    ports:
      - "8025:8025"
      - "1025:1025"

volumes:
  postgres_data:
  redis_data:
```

Mailpit is a lightweight email testing tool that catches emails sent by your application instead of delivering them. Access its web interface at `http://localhost:8025`. Configure your application to use `mailpit:1025` as the SMTP server.

## MongoDB with Mongo Express

For projects using MongoDB instead of PostgreSQL:

```yaml
services:
  mongo:
    image: mongo:7
    container_name: project-mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: dev
      MONGO_INITDB_ROOT_PASSWORD: devpassword
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  mongo-express:
    image: mongo-express
    container_name: project-mongo-express
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: dev
      ME_CONFIG_MONGODB_ADMINPASSWORD: devpassword
      ME_CONFIG_MONGODB_URL: mongodb://dev:devpassword@mongo:27017/
    ports:
      - "8081:8081"
    depends_on:
      - mongo

volumes:
  mongo_data:
```

Mongo Express provides a web-based admin interface at `http://localhost:8081`. It is not as polished as pgAdmin, but it handles the essentials: browsing databases, viewing documents, and running queries.

## MySQL with phpMyAdmin

For projects that require MySQL compatibility:

```yaml
services:
  mysql:
    image: mysql:8
    container_name: project-mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: app_db
      MYSQL_USER: dev
      MYSQL_PASSWORD: devpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

  phpmyadmin:
    image: phpmyadmin
    container_name: project-phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_USER: dev
      PMA_PASSWORD: devpassword
    ports:
      - "8888:80"
    depends_on:
      - mysql

volumes:
  mysql_data:
```

The `--default-authentication-plugin=mysql_native_password` flag avoids authentication issues with older MySQL client libraries. Access phpMyAdmin at `http://localhost:8888`.

## Tips for All Templates

**Never commit passwords to version control.** Use `.env` files for secrets and add `.env` to your `.gitignore`:

```bash
# .env
POSTGRES_PASSWORD=your-secure-password
REDIS_PASSWORD=your-secure-password
```

Reference these in your compose file:

```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

**Use health checks for all databases.** Your application should wait for the database to be ready before attempting to connect. The `depends_on` directive only waits for the container to start, not for the service inside it to be ready. Health checks solve this.

**Pin your image versions.** Always specify a major version like `postgres:16` rather than `postgres:latest`. A version bump in the base image can break your application unexpectedly. Pinning ensures reproducible builds.

**Name your volumes.** Named volumes (like `postgres_data`) persist across container recreations. Anonymous volumes get deleted when you run `docker compose down`. Named volumes are almost always what you want in development.

## Conclusion

Keep these templates in a central directory and copy the one you need when starting a new project. Over time, you will develop your own variations that match your specific stack. The goal is to never write a compose file from scratch again -- start with a proven template and customize the parts that differ.
