# Sử dụng Node.js làm base image
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./
# Cài đặt dependencies
RUN npm install

# Copy source code
COPY . .

# Expose cổng 5000
EXPOSE 5000

# Khởi chạy ứng dụng
CMD ["npm", "start"] 