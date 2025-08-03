#!/bin/bash

# 服务器环境设置脚本
# 更新 Node.js 和安装 PM2

set -e

# 配置信息
REMOTE_HOST="47.120.11.77"
REMOTE_USER="root"
REMOTE_PASSWORD="Wzyuan042200"

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

echo "🔧 开始设置服务器环境..."

# 在服务器上执行环境设置
log_info "更新服务器环境..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
echo "检查当前 Node.js 版本..."
node --version || echo "Node.js 未安装"

echo "安装 Node.js 18.x..."
# 下载并安装 Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

echo "验证 Node.js 安装..."
node --version
npm --version

echo "安装 PM2..."
npm install -g pm2

echo "创建应用目录..."
mkdir -p /opt/feishu-webhook
mkdir -p /opt/feishu-webhook/logs

echo "设置 PM2 开机自启..."
pm2 startup

echo "环境设置完成"
EOF

log_success "服务器环境设置完成！"

# 检查设置结果
log_info "检查设置结果..."
sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
echo "Node.js 版本:"
node --version

echo "npm 版本:"
npm --version

echo "PM2 版本:"
pm2 --version

echo "应用目录:"
ls -la /opt/feishu-webhook/
EOF

log_success "服务器环境设置完成！"
echo "🌐 现在可以运行 ./manage.sh deploy 进行部署" 