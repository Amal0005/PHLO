# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Only install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built assets
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/phlo-483705-7df390b1c765.json ./

EXPOSE 5000
CMD ["node", "dist/app.js"]
