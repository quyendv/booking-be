# Build stage
FROM node:18-alpine as build

WORKDIR /app 

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Run stage
FROM node:18-alpine as run

WORKDIR /app

# ENV NODE_ENV=production # set NODE_ENV in docker-compose file to use only 1 Dockerfile

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

COPY . .

# CMD ["node", "dist/main"]
CMD ["node", "dist/src/main"]