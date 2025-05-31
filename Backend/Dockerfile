# Stage 1: Build the Node.js backend
FROM node:22-alpine AS build-stage

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ackage*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on
EXPOSE 4080

# Start the Node.js server
CMD ["node", "index.js"]