FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM docker.io/nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
