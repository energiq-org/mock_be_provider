# base for our image, based on buildpack-deps, based on Debian Linux
FROM node:lts AS builder

WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN npm install

# Copy application source code
COPY . .
RUN npm run build

FROM node:lts-slim AS runner
WORKDIR /app
COPY package.json .
COPY ./mock ./mock
RUN npm install --omit=dev
COPY --from=builder /app/dist /app/
CMD ["node", "index.js"]
