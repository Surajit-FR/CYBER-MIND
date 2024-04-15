# Use a lightweight Node.js image
FROM node:alpine

# Create a working directory inside the container
WORKDIR /app

# Copy the package.json file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Expose port 4040
EXPOSE 4040

# Start the development server
CMD [ "npm", "run", "dev" ]