# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port your Node.js server will run on (adjust this to match your server)
EXPOSE 5300

# Set the default command to run your Node.js server in development mode using yarn
CMD ["yarn", "run", "dev"]
