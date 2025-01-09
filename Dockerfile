# Stage 1: Build the Angular application
FROM node:18 as build-angular
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx nx build-many --projects=termintasy,termintasy-backend --parallel

FROM node:18 as runtime
WORKDIR /app

# Copy Angular build files to serve via a static file server
COPY  /app/dist/apps/termintasy /app/angular

# Copy NestJS build files
COPY  /app/dist/apps/termintasy-backend /app/nestjs

# Install necessary packages
RUN npm install -g http-server

# Copy entrypoint script to handle migrations and seeding
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the two ports for serving Angular and NestJS
EXPOSE 4200 3000

# Set the entrypoint to run the script before starting the applications
ENTRYPOINT ["/entrypoint.sh"]

# Run both Angular and NestJS applications (after seeding and migration)
CMD ["sh", "-c", "http-server /app/angular -p 4200 & node /app/nestjs/main.js"]
