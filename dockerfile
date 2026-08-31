
# #copy the dist folder content in backend/public folder

# FROM node:20-alpine AS frontend-builder

# COPY ./Frontend /app

# WORKDIR /app

# RUN npm install

# RUN npm run build

# #build for backend

# FROM node:20-alpine

# COPY ./Backend /app

# WORKDIR /app

# RUN npm install

# COPY --from=frontend-builder /app/dist /app/public

# CMD [ "node","server.js" ]
