FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制构建产物
COPY dist ./dist

# 创建日志目录
RUN mkdir -p /app/logs

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/index.js"]
