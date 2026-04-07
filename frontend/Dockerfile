FROM node:22-alpine AS deps

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json ./
RUN pnpm install

FROM node:22-alpine AS build

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=deps /app/node_modules ./node_modules
COPY package.json vite.config.js index.html ./
COPY src/ ./src/

RUN pnpm build

FROM nginx:alpine

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && chown appuser:appgroup /var/run/nginx.pid

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
