---
title: "How to Automate Your Dev Workflow with Shell Scripts"
description: "Learn to write shell scripts that automate repetitive development tasks -- from project setup and deployment to testing and environment management."
date: 2026-04-26
tags: [shell, automation, devops]
layout: article.njk
---

Every developer has tasks they repeat daily: setting up projects, running test suites, deploying code, switching environments. Each one is small enough that doing it manually does not feel wasteful. But over months and years, these repetitive actions consume hundreds of hours. Shell scripts are the simplest way to reclaim that time, and you do not need to be a Bash expert to write useful ones.

## Start with the Tasks You Do Every Day

The best candidates for automation are tasks that meet two criteria: you do them frequently, and they involve multiple steps that must be executed in sequence. If you only do something once a month, the automation is not worth the maintenance. If a task is a single command, an alias suffices.

Good automation targets:

- **Project initialization**: Creating the directory structure, initializing git, installing dependencies
- **Environment setup**: Copying .env templates, starting Docker containers, running migrations
- **Deployment workflows**: Building, testing, tagging, and pushing in one step
- **Cleanup tasks**: Removing generated files, pruning Docker images, clearing caches

## Your First Useful Script: Project Bootstrapper

Most developers start new projects the same way every time. Here is a script that automates the entire process:

```bash
#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME=${1:?Usage: new-project <name>}

mkdir -p "$PROJECT_NAME"/{src,tests,docs}
cd "$PROJECT_NAME"

git init
cat > README.md << EOF
# $PROJECT_NAME
EOF

cat > .gitignore << EOF
node_modules/
dist/
.env
*.log
EOF

git add .
git commit -m "Initial project structure"

echo "Project $PROJECT_NAME created and initialized."
```

Save this as `new-project` somewhere on your PATH, make it executable with `chmod +x new-project`, and you have a single command that creates a fully initialized project. Customize the template directories and files to match your actual workflow.

The `set -euo pipefail` line at the top is critical. It tells Bash to exit immediately on errors (`-e`), treat unset variables as errors (`-u`), and fail pipelines on the first error (`-o pipefail`). Without this, a script will silently continue after a failed command, which can lead to broken state.

## Environment Management Script

Switching between projects often means changing environment variables, Docker containers, and database connections. A script that manages this eliminates the mental overhead:

```bash
#!/usr/bin/env bash
set -euo pipefail

ACTION=${1:?Usage: envctl <start|stop|status>}
PROJECT=${2:-default}

case "$ACTION" in
  start)
    cp ".env.$PROJECT" .env 2>/dev/null || echo "No .env.$PROJECT found"
    docker compose up -d
    echo "Environment started for $PROJECT"
    ;;
  stop)
    docker compose down
    echo "Environment stopped"
    ;;
  status)
    docker compose ps
    echo "Current .env targets: $PROJECT"
    ;;
  *)
    echo "Unknown action: $ACTION"
    exit 1
    ;;
esac
```

With this script, switching from your staging configuration to your local development configuration is a single command: `envctl start local`. The script copies the correct environment file and starts the right Docker containers.

## Deployment Script That Actually Works

Deployment scripts often grow into fragile, unmaintainable monsters. The key to keeping them manageable is to make each step explicit and add verification at every stage:

```bash
#!/usr/bin/env bash
set -euo pipefail

BRANCH=$(git branch --show-current)

if [[ "$BRANCH" != "main" ]]; then
  echo "Deploy only from main branch. Current: $BRANCH"
  exit 1
fi

# Ensure clean working tree
if [[ -n $(git status --porcelain) ]]; then
  echo "Working tree is not clean. Commit or stash changes first."
  exit 1
fi

# Run tests first
echo "Running tests..."
npm test

# Build
echo "Building..."
npm run build

# Tag the release
VERSION="v$(date +%Y%m%d-%H%M%S)"
git tag "$VERSION"
git push origin main --tags

echo "Deployed as $VERSION"
```

This script guards against the two most common deployment mistakes: deploying from the wrong branch and deploying with uncommitted changes. It also runs tests before proceeding, ensuring that broken code never reaches production.

The version tag uses a timestamp format rather than semantic versioning, which is appropriate for internal tools and staging environments. For production releases, replace it with a prompt for the version number or read it from a config file.

## Database Backup Script

A script that backs up your database before risky operations is cheap insurance:

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="$HOME/.backups/postgres"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"

pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"

# Keep only the last 10 backups
ls -t "$BACKUP_DIR"/*.sql.gz | tail -n +11 | xargs -r rm

echo "Backup saved to $BACKUP_FILE"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"
```

The script automatically prunes old backups, keeping only the ten most recent. This prevents disk space from filling up with outdated backups while ensuring you always have recent recovery points.

## Making Scripts Discoverable

Scripts only help if you remember they exist. Two practices keep your automation useful:

First, store all custom scripts in a dedicated directory like `~/.local/bin` and add it to your PATH. This keeps them separate from system binaries and makes them easy to version control.

Second, add a help command to every script. Even a simple usage message in the error handler counts:

```bash
ACTION=${1:?Usage: deploy <staging|production>}
```

When you run the script without arguments, it prints the usage instead of failing silently.

## Testing Your Scripts

Shell scripts are code, and code needs testing. The simplest approach is to create a test script that runs each command in a safe environment:

```bash
#!/usr/bin/env bash
set -euo pipefail

TEST_DIR=$(mktemp -d)
trap "rm -rf $TEST_DIR" EXIT

cd "$TEST_DIR"

# Test: new-project creates the expected structure
new-project test-app
[[ -d test-app/src ]] || { echo "FAIL: src directory missing"; exit 1; }
[[ -d test-app/tests ]] || { echo "FAIL: tests directory missing"; exit 1; }
[[ -f test-app/.gitignore ]] || { echo "FAIL: .gitignore missing"; exit 1; }

echo "All tests passed."
```

The `mktemp -d` creates an isolated temporary directory, and the `trap` ensures cleanup even if the test fails. This pattern works for any script that creates files or directories.

## Conclusion

Shell scripts are the most accessible form of development automation. They require no additional tools, run everywhere, and solve real problems immediately. Start by scripting the one task that annoys you most -- the thing you do every day that takes just long enough to be irritating. Once you experience the satisfaction of replacing a five-minute manual process with a single command, you will find yourself automating everything.
