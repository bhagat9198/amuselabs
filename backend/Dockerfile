# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy only package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Expose the port your Node.js server will run on
EXPOSE 5300

# Run Node.js in development mode with hot reloading
CMD ["yarn", "dev"]
