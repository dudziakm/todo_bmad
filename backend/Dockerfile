FROM node:22-alpine AS deps

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json ./
RUN pnpm install --prod

FROM node:22-alpine

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src/ ./src/

RUN mkdir -p /app/data && chown -R appuser:appgroup /app/data

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "src/index.js"]
