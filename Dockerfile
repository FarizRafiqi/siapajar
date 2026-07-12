# --- Build Stage ---
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig*.json ./
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:24-alpine

WORKDIR /app
RUN addgroup --system app && adduser --system -G app app

# Install PostgreSQL client for migrations (optional — ace handles it via knex)
RUN apk add --no-cache tini

# Copy production deps + build output
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/resources ./resources
COPY --from=builder /app/.adonisjs ./.adonisjs

# Copy entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER app

EXPOSE 3333

ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
CMD ["node", "build/bin/server.js"]
