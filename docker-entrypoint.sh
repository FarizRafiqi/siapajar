#!/bin/sh
set -e

echo "=== Running database migrations ==="
node build/bin/console.js ace migration:run --force

echo "=== Running database seeders ==="
node build/bin/console.js ace db:seed

echo "=== Starting application server ==="
exec "$@"
