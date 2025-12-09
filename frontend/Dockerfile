# Build stage
FROM node:20-alpine AS builder

# enable yarn
RUN corepack enable
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn config set network-timeout 600000

WORKDIR /app

# copy manifest files
COPY package.json yarn.lock ./

# install deps
RUN yarn install --frozen-lockfile

COPY . .

# build
RUN yarn build



# Runtime stage
FROM node:20-alpine

RUN corepack enable

WORKDIR /app

COPY package.json yarn.lock ./

# install only production deps
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 4173
RUN yarn global add vite
CMD ["vite", "preview", "--host", "0.0.0.0", "--port", "4173"]
HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -q --spider http://localhost:4173/health || exit 1