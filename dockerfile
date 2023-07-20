# Use the official Node.js image as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npx prisma generate --schema=prisma/schema.sql.prisma

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "app.js"]