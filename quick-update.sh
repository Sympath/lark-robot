#!/bin/bash

# 快速更新脚本 - 一行命令更新服务
# 构建 -> 上传 -> 重启 Docker 容器

set -e

echo "🚀 快速更新飞书 Webhook 服务器..."

# 配置信息
REMOTE_HOST="47.120.11.77"
REMOTE_USER="root"
REMOTE_PASSWORD="Wzyuan042200"
REMOTE_DIR="/opt/feishu-webhook"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 1. 构建项目
log_info "构建项目..."
npm run build
log_success "项目构建完成"

# 2. 上传文件
log_info "上传文件到服务器..."
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no -r dist "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no package.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no package-lock.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
log_success "文件上传完成"

# 3. 重启服务
log_info "重启 Docker 容器..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
cd /opt/feishu-webhook

# 停止并删除旧容器
docker stop feishu-webhook || true
docker rm feishu-webhook || true

# 重新构建镜像
docker build -t feishu-webhook .

# 启动新容器
docker run -d \
  --name feishu-webhook \
  --restart unless-stopped \
  -p 3000:3000 \
  -v /opt/feishu-webhook/logs:/app/logs \
  -e NODE_ENV=production \
  -e PORT=3000 \
  feishu-webhook

echo "服务重启完成"
EOF

log_success "服务重启完成"

# 4. 检查状态
log_info "检查服务状态..."
sleep 10
response=$(curl -s -o /dev/null -w "%{http_code}" http://47.120.11.77:3000/api/health || echo "000")

if [ "$response" = "200" ]; then
    log_success "✅ 更新成功！服务正常运行"
    echo "🌐 服务地址: http://47.120.11.77:3000"
    echo "🧪 测试页面: http://47.120.11.77:3000/case"
else
    echo "❌ 更新失败，请检查服务状态"
fi 