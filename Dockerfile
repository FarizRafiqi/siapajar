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
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/build ./build
# Copy built frontend assets (Vite manifest + bundles) over the source public/
COPY --from=builder /app/build/public ./public
COPY --from=builder /app/resources ./resources
COPY --from=builder /app/.adonisjs ./.adonisjs

USER app

EXPOSE 3333

ENTRYPOINT ["tini", "--"]
CMD ["node", "build/bin/server.js"]
