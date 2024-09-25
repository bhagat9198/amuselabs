# Use an official Node.js image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Expose the Vite dev server port
EXPOSE 5174

# Run Vite in development mode with hot module replacement
CMD ["yarn", "dev"]
