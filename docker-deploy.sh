#!/bin/bash

# 基于 Docker 的飞书 Webhook 服务器部署脚本
# 目标服务器: 47.120.11.77

set -e

echo "🐳 开始基于 Docker 部署飞书 Webhook 服务器..."

# 配置信息
REMOTE_HOST="47.120.11.77"
REMOTE_USER="root"
REMOTE_PASSWORD="Wzyuan042200"
REMOTE_DIR="/opt/feishu-webhook"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查本地构建
log_info "检查本地构建产物..."
if [ ! -d "dist" ]; then
    log_error "构建产物目录不存在，请先运行 npm run build"
    exit 1
fi

log_success "本地构建产物检查通过"

# 创建 Dockerfile
log_info "创建 Dockerfile..."
cat > Dockerfile << 'EOF'
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
EOF

log_success "Dockerfile 创建完成"

# 创建 docker-compose.yml
log_info "创建 docker-compose.yml..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  feishu-webhook:
    build: .
    container_name: feishu-webhook
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
EOF

log_success "docker-compose.yml 创建完成"

# 创建远程目录
log_info "创建远程目录..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
mkdir -p /opt/feishu-webhook
mkdir -p /opt/feishu-webhook/logs
EOF

log_success "远程目录创建完成"

# 上传文件
log_info "上传文件到服务器..."
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no -r dist "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no package.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no package-lock.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no Dockerfile "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no docker-compose.yml "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

log_success "文件上传完成"

# 在服务器上安装 Docker 并启动服务
log_info "在服务器上安装 Docker 并启动服务..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
cd /opt/feishu-webhook

# 安装 Docker (如果未安装)
if ! command -v docker &> /dev/null; then
    echo "安装 Docker..."
    yum install -y yum-utils
    yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
    yum install -y docker-ce docker-ce-cli containerd.io
    systemctl start docker
    systemctl enable docker
fi

# 安装 Docker Compose (如果未安装)
if ! command -v docker-compose &> /dev/null; then
    echo "安装 Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# 停止现有容器
echo "停止现有容器..."
docker-compose down || true

# 构建并启动服务
echo "构建并启动服务..."
docker-compose up -d --build

# 等待服务启动
echo "等待服务启动..."
sleep 30

echo "服务启动完成"
EOF

log_success "服务部署完成！"

# 检查服务状态
log_info "检查服务状态..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
echo "Docker 容器状态:"
docker-compose ps

echo "服务日志:"
docker-compose logs --tail=10
EOF

log_success "部署完成！"
echo "🌐 服务地址: http://47.120.11.77:3000"
echo "📊 健康检查: http://47.120.11.77:3000/api/health"
echo "🧪 测试页面: http://47.120.11.77:3000/case"

# 清理本地文件
log_info "清理本地文件..."
rm -f Dockerfile docker-compose.yml
log_success "清理完成" 