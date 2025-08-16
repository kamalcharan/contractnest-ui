FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source
COPY . .

# Railway automatically provides environment variables at build time
# Just build - no need for ARG/ENV declarations
RUN npm run build:prod

RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]