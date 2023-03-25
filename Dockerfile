# Use the official Node.js image as a base image for the builder
FROM node:18 AS builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm ci

# Copy the remaining files to the working directory
COPY . .

# Build the NestJS project
RUN npm run build

# Use the official Node.js image as a base image for the final image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Copy the build artifacts from the builder stage
COPY --from=builder /app/dist /app/dist

# Expose the port your application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]