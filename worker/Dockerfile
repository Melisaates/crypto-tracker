# The reason why we seperate build and runtime stages is to optimize the final image size
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
# Copy built files and environment variables
COPY --from=builder /app/dist ./dist
COPY .env .env
# Start the application
CMD ["node", "dist/main.js"]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "executable" ]
RUN curl --fail http://localhost:3000/health || exit 1
