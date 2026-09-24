FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for tsx build/runtime)
RUN npm install

# Copy source code
COPY . .

# Build Vite frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start server using tsx
CMD ["npm", "start"]
