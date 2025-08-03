#!/bin/bash

# 飞书 Webhook 服务器一键更新脚本
# 构建 -> 上传 -> 重启服务

set -e

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

# 配置信息
REMOTE_HOST="47.120.11.77"
REMOTE_USER="root"
REMOTE_PASSWORD="Wzyuan042200"
REMOTE_DIR="/opt/feishu-webhook"

echo "🚀 开始一键更新飞书 Webhook 服务器..."

# 1. 构建项目
log_info "步骤 1: 构建项目..."
npm run build
log_success "项目构建完成"

# 2. 上传文件
log_info "步骤 2: 上传文件到服务器..."
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no -r dist "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no package.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no package-lock.json "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
log_success "文件上传完成"

# 3. 重启服务
log_info "步骤 3: 重启服务..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
cd /opt/feishu-webhook

# 安装依赖
echo "安装依赖..."
npm install --production

# 重启 PM2 服务
echo "重启服务..."
pm2 restart feishu-webhook || pm2 start dist/index.js --name feishu-webhook --log /opt/feishu-webhook/logs/app.log --error /opt/feishu-webhook/logs/error.log

# 保存配置
pm2 save

echo "服务重启完成"
EOF

log_success "服务重启完成"

# 4. 检查服务状态
log_info "步骤 4: 检查服务状态..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
echo "PM2 进程状态:"
pm2 list

echo "服务日志 (最近10行):"
pm2 logs feishu-webhook --lines 10
EOF

log_success "更新完成！"
echo "🌐 服务地址: http://47.120.11.77:3000"
echo "📊 健康检查: http://47.120.11.77:3000/api/health"
echo "🧪 测试页面: http://47.120.11.77:3000/case" 