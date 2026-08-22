# --- Build Stage ---
FROM node:24-bookworm-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:24-bookworm-slim

WORKDIR /app
RUN addgroup --system app && adduser --system --ingroup app app

RUN apt-get update \
  && apt-get install -y --no-install-recommends tini \
  && rm -rf /var/lib/apt/lists/*

# Copy production deps + build output
# package.json has "prepare": "husky" (devDep) — with --omit=dev the husky
# binary is absent, so npm's prepare script fails with "husky: not found".
# Delete the script here; hooks are a dev-only concern (HUSKY=0 is belt & braces).
COPY package*.json ./
RUN npm pkg delete scripts.prepare && npm ci --omit=dev && npm cache clean --force

# Exam PDF export uses the same Chromium renderer as print preview.
# Keep the browser in a shared path so the unprivileged app user can execute it.
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
RUN npx playwright install --with-deps chromium \
  && chmod -R a+rX /ms-playwright

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
