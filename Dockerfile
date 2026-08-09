# --- Build Stage ---
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:24-alpine

WORKDIR /app
RUN addgroup --system app && adduser --system -G app app

RUN apk add --no-cache tini

# Copy production deps + build output
# package.json has "prepare": "husky" (devDep) — with --omit=dev the husky
# binary is absent, so npm's prepare script fails with "husky: not found".
# Delete the script here; hooks are a dev-only concern (HUSKY=0 is belt & braces).
COPY package*.json ./
RUN npm pkg delete scripts.prepare && npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/build ./build
# Copy built frontend assets (Vite manifest + bundles) over the source public/
COPY --from=builder /app/build/public ./public
COPY --from=builder /app/resources ./resources
COPY --from=builder /app/.adonisjs ./.adonisjs

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER app

EXPOSE 3333

ENTRYPOINT ["tini", "--", "docker-entrypoint.sh"]
