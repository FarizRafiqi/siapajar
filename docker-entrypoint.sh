#!/bin/sh
# Do NOT use set -e — migration/seed might legitimately fail
# on first deploy with a fresh DB, and we still want the server to start

echo "=== Running database migrations ==="
node build/bin/console.js migration:run --force
echo "Migration exit code: $?"

echo "=== Running database seeders ==="
node build/bin/console.js db:seed
echo "Seed exit code: $?"

# Start the background queue worker (ai, reports, audit, maintenance queues) — Redis-backed
# in production per README/CLAUDE.md. With the sync driver jobs run inline
# inside the web process, so a worker is neither needed nor started.
if [ "$QUEUE_DRIVER" = "redis" ]; then
  echo "=== Starting queue worker (ai, reports, audit, maintenance) ==="
  node build/bin/console.js queue:work --queue ai,reports,audit,maintenance &
fi

echo "=== Starting application server ==="
exec node build/bin/server.js
