# Use an official Node.js image as the base
FROM node:21

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite React app
RUN npm run build

# Install a lightweight server to serve the static files
RUN npm install -g serve

# Expose the port Vite runs on
EXPOSE 5173

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "5173"]
