FROM oven/bun:1.3.14-alpine AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM docker.io/nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
