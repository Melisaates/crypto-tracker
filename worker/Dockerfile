# Build stage
FROM node:20-alpine AS builder

# yarn registry + retry config
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn config set network-timeout 600000

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build



# Runtime stage
FROM node:20-alpine

WORKDIR /app

# only production deps
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

# copy built files
COPY --from=builder /app/dist ./dist
COPY .env .env

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -q --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/main.js"]
