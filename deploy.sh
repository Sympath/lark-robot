#!/bin/bash

# 飞书 Webhook 服务器部署脚本
# 目标服务器: 47.120.11.77

set -e

echo "🚀 开始部署飞书 Webhook 服务器..."

# 配置信息
REMOTE_HOST="47.120.11.77"
REMOTE_USER="root"
REMOTE_PASSWORD="Wzyuan042200"
REMOTE_DIR="/opt/feishu-webhook"
LOCAL_DIST_DIR="dist"
LOCAL_PACKAGE_FILE="package.json"
LOCAL_PACKAGE_LOCK="package-lock.json"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
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
if [ ! -d "$LOCAL_DIST_DIR" ]; then
    log_error "构建产物目录不存在，请先运行 npm run build"
    exit 1
fi

if [ ! -f "$LOCAL_PACKAGE_FILE" ]; then
    log_error "package.json 文件不存在"
    exit 1
fi

log_success "本地构建产物检查通过"

# 创建远程目录
log_info "创建远程目录..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
mkdir -p /opt/feishu-webhook
mkdir -p /opt/feishu-webhook/logs
EOF

log_success "远程目录创建完成"

# 上传文件
log_info "上传构建产物到服务器..."
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no -r "$LOCAL_DIST_DIR" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no "$LOCAL_PACKAGE_FILE" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"
sshpass -p "$REMOTE_PASSWORD" scp -o StrictHostKeyChecking=no "$LOCAL_PACKAGE_LOCK" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/"

log_success "文件上传完成"

# 在服务器上安装依赖和启动服务
log_info "在服务器上安装依赖并启动服务..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
cd /opt/feishu-webhook

# 安装依赖
echo "安装 Node.js 依赖..."
npm install --production

# 安装 PM2 (如果未安装)
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi

# 停止现有服务
echo "停止现有服务..."
pm2 stop feishu-webhook || true
pm2 delete feishu-webhook || true

# 启动服务
echo "启动服务..."
pm2 start dist/index.js --name feishu-webhook --log /opt/feishu-webhook/logs/app.log --error /opt/feishu-webhook/logs/error.log

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup

echo "服务启动完成"
EOF

log_success "服务部署完成！"

# 检查服务状态
log_info "检查服务状态..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
echo "PM2 进程列表:"
pm2 list

echo "服务日志:"
pm2 logs feishu-webhook --lines 10
EOF

log_success "部署完成！"
echo "🌐 服务地址: http://47.120.11.77:3000"
echo "📊 健康检查: http://47.120.11.77:3000/api/health"
echo "🧪 测试页面: http://47.120.11.77:3000/case" 