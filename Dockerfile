# Multi-stage production Dockerfile for MultiLuz Studio
FROM node:20-slim AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build Vite frontend
RUN npm run build

# Production runtime stage
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package definitions
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built frontend assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/assets ./src/assets

# Expose standard port
EXPOSE 3000

# Start server using tsx
CMD ["npm", "start"]
