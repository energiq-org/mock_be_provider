# base for our image, based on buildpack-deps, based on Debian Linux
FROM node:lts

# Create app directory
WORKDIR /opt/api-example

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production

# Add ts-node explicitly if it's missing
RUN yarn add ts-node

# Copy application source code
COPY . .

# Build the TypeScript application
RUN NODE_OPTIONS=--max-old-space-size=8192 yarn build

# Expose the application port
EXPOSE 3000

# Set environment variable for the default env file
ENV ENV_FILE=./config/.env.prod

# Run the app with the specified command
CMD ["node", "-r", "ts-node/register/transpile-only", "-r", "tsconfig-paths/register", "bin/src/app.js"]
