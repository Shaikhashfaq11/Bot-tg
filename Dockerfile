FROM node:20-slim

WORKDIR /app

# Install dependencies with legacy peer deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code and files
COPY . .

# Build assets
RUN npm run build

# Render supplies PORT dynamically (defaulting to 10000 or 3000)
EXPOSE 3000 10000

# Start command
CMD ["npm", "start"]
