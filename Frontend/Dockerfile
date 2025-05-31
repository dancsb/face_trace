# Stage 1: Build the Angular app with SSR and SSG
FROM node:22-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application files
COPY . .

# Set the build configuration
ARG BUILD_CONFIG=testing

# Build the Angular app with SSR and SSG
RUN if [ "$BUILD_CONFIG" = "testing" ]; then \
        npm run build:testing; \
    else \
        npm run build; \
    fi

# Stage 2: Set up the production environment to serve the app
FROM node:22-alpine AS production-stage

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build-stage
COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/package*.json ./

# Install only production dependencies
RUN npm ci

# Expose the port the app will run on
EXPOSE 4000

# Start the SSR server
CMD ["npm", "run", "serve:ssr:Frontend"]