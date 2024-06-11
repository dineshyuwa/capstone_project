FROM node:16

WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

RUN npm install 

# Install necessary type definitions for TypeScript
RUN npm install --save-dev @types/cors
RUN npm install --save-dev @types/bcrypt @types/jsonwebtoken


# Copy the rest of the application code
COPY . .

# Copy the .env file
COPY .env .env

EXPOSE 3000

CMD ["npm", "start"]
