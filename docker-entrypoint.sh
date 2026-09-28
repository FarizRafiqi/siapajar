#!/bin/sh
set -eu

echo "=== Running database migrations ==="
node build/bin/console.js migration:run --force

if [ "${SEED_ON_STARTUP:-false}" = "true" ]; then
  echo "=== Running database seeders (SEED_ON_STARTUP=true) ==="
  node build/bin/console.js db:seed
else
  echo "=== Skipping database seeders (set SEED_ON_STARTUP=true for a disposable/demo environment) ==="
fi

# Start the background queue worker (ai, reports, audit, maintenance queues) — Redis-backed
# in production per README/CLAUDE.md. With the sync driver jobs run inline
# inside the web process, so a worker is neither needed nor started.
if [ "$QUEUE_DRIVER" = "redis" ]; then
  echo "=== Starting queue worker (ai, exam-generation, reports, audit, maintenance) ==="
  node build/bin/console.js queue:work --queue ai,exam-generation,reports,audit,maintenance &
fi

echo "=== Starting application server ==="
exec node build/bin/server.js
