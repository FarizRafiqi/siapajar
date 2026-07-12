#!/bin/sh
# Do NOT use set -e — migration/seed might legitimately fail
# on first deploy with a fresh DB, and we still want the server to start

echo "=== Running database migrations ==="
node build/bin/console.js migration:run --force
echo "Migration exit code: $?"

echo "=== Running database seeders ==="
node build/bin/console.js db:seed
echo "Seed exit code: $?"

echo "=== Starting application server ==="
exec node build/bin/server.js
