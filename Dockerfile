# Build stage: frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci
COPY frontend/ ./frontend/
# Vite outputs to ../backend/dist relative to frontend
RUN cd frontend && npm run build

# Runtime stage: backend
FROM node:22-alpine AS backend
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY backend/ .
# Copy pre-built frontend from build stage
COPY --from=frontend-build /app/backend/dist ./dist

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
