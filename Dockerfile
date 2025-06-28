# ========== Build Stage ==========
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ========== Production Stage ==========
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove default config and expose port 80
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
