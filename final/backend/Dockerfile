
FROM node:18-alpine

RUN apk add --no-cache python3 make g++

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy các file khai báo dependency trước để tối ưu cache layer
COPY package*.json ./

# Cài dependency và rebuild bcrypt cho đúng môi trường Linux
RUN npm install
RUN npm rebuild bcrypt --build-from-source

# Copy toàn bộ source code vào container
COPY . .

# Mở cổng backend
EXPOSE 5000

# Chạy server
CMD ["node", "server.js"]
