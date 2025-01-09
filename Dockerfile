# Stage 1: Build the Angular application
FROM node:18 as build-angular
WORKDIR /app
COPY . .
RUN npm ci
RUN npx nx build termintasy --configuration=production

# Stage 2: Build the NestJS application
FROM node:18 as build-nestjs
WORKDIR /app
COPY . .
RUN npm ci
RUN npx nx build termintasy-backend

# Stage 3: Serve the applications
FROM node:18 as runtime
WORKDIR /app

# Copy Angular build files to serve via a static file server
COPY --from=build-angular /app/dist/apps/termintasy /app/angular

# Copy NestJS build files
COPY --from=build-nestjs /app/dist/apps/termintasy-backend /app/nestjs

# Install a lightweight HTTP server for Angular
RUN npm install -g http-server

# Expose the two ports for serving Angular and NestJS
EXPOSE 4200 3000

# Run both applications
CMD ["sh", "-c", "http-server /app/angular -p 4200 & node /app/nestjs/main.js"]
