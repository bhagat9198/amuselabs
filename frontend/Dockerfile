# Use an official Node.js image
FROM node:22

# Set working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the Vite dev server port (adjust as needed)
EXPOSE 5174

# Run Vite in development mode
CMD ["yarn", "dev"]
