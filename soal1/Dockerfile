# Use an official lightweight Node.js image
FROM node:20-alpine

# Create and set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application code
COPY server.js ./

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
