# --- Build Stage ---
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:24-alpine

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/ace.js ./

ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3333

CMD ["node", "ace.js", "serve"]
