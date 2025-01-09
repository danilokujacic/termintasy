# Stage 1: Build the Angular application
FROM node:18 as build-projects
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application files
COPY . ./

# Build the Angular application
RUN npx nx run-many -t=build --prod

# Stage 3: Serve the applications
FROM node:18 as runtime
WORKDIR /app

# Copy the Angular build files to the runtime container
COPY --from=build-projects /app/dist/apps/termintasy /app/angular

# Copy the NestJS build files to the runtime container
COPY --from=build-projects /app/dist/apps/termintasy-backend /app/nestjs

# Install the HTTP server to serve Angular
RUN npm install -g http-server

# Copy entrypoint script for migrations and seeding
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the necessary ports
EXPOSE 4200 3000

# Set the entrypoint to handle migrations and start both applications
ENTRYPOINT ["/entrypoint.sh"]

# Run Angular and NestJS applications after migration and seeding
CMD ["sh", "-c", "http-server /app/angular -p 4200 & node /app/nestjs/main.js"]
