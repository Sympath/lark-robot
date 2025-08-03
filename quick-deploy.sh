#!/bin/bash

# 快速部署脚本
set -e

echo "🚀 飞书Webhook服务器快速部署"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
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

# 检查Git状态
log_info "检查Git状态..."
if [ -d ".git" ]; then
    git status --porcelain
    if [ $? -eq 0 ]; then
        log_success "Git仓库状态正常"
    else
        log_warning "Git仓库有未提交的更改"
    fi
else
    log_warning "当前目录不是Git仓库"
fi

# 构建项目
log_info "构建项目..."
npm run build
log_success "构建完成"

# 本地测试
log_info "执行本地测试..."
timeout 10s npm start &
sleep 5
curl -f http://localhost:3000/api/health > /dev/null 2>&1
if [ $? -eq 0 ]; then
    log_success "本地测试通过"
else
    log_warning "本地测试失败，但继续部署"
fi

# 停止本地服务
pkill -f "node dist/index.js" || true

echo ""
echo "📋 部署选项："
echo "1. Railway (推荐 - 免费且简单)"
echo "2. Render (免费且稳定)"
echo "3. Vercel (最简单)"
echo "4. Docker (本地部署)"
echo "5. 查看详细指南"
echo ""

read -p "请选择部署方式 (1-5): " choice

case $choice in
    1)
        log_info "准备部署到Railway..."
        echo "请按照以下步骤操作："
        echo "1. 访问 https://railway.app"
        echo "2. 使用GitHub账户登录"
        echo "3. 点击 'New Project'"
        echo "4. 选择 'Deploy from GitHub repo'"
        echo "5. 选择你的仓库"
        echo "6. Railway会自动检测并部署"
        echo ""
        echo "部署完成后，你的服务地址将是："
        echo "https://your-app-name.railway.app"
        ;;
    2)
        log_info "准备部署到Render..."
        echo "请按照以下步骤操作："
        echo "1. 访问 https://render.com"
        echo "2. 使用GitHub账户登录"
        echo "3. 点击 'New +' → 'Web Service'"
        echo "4. 连接GitHub仓库"
        echo "5. 配置："
        echo "   - Name: feishu-webhook"
        echo "   - Environment: Node"
        echo "   - Build Command: npm install && npm run build"
        echo "   - Start Command: node dist/index.js"
        echo "   - Health Check Path: /api/health"
        echo "6. 点击 'Create Web Service'"
        ;;
    3)
        log_info "准备部署到Vercel..."
        echo "请按照以下步骤操作："
        echo "1. 安装Vercel CLI: npm i -g vercel"
        echo "2. 运行: vercel --prod"
        echo "3. 按照提示配置项目"
        ;;
    4)
        log_info "准备Docker部署..."
        echo "请按照以下步骤操作："
        echo "1. 确保Docker已安装"
        echo "2. 运行: docker build -t feishu-webhook ."
        echo "3. 运行: docker-compose -f docker-compose.prod.yml up -d"
        echo "4. 检查状态: docker-compose -f docker-compose.prod.yml ps"
        ;;
    5)
        log_info "打开详细部署指南..."
        if command -v open &> /dev/null; then
            open DEPLOYMENT_GUIDE.md
        else
            echo "请手动打开 DEPLOYMENT_GUIDE.md 文件"
        fi
        ;;
    *)
        echo "无效选择"
        exit 1
        ;;
esac

echo ""
log_success "部署指南已提供！"
echo ""
echo "📞 如果需要帮助，请查看 DEPLOYMENT_GUIDE.md"
echo "🔗 部署完成后，记得测试以下功能："
echo "   - 健康检查: https://your-app-url/api/health"
echo "   - 测试页面: https://your-app-url/case"
echo "   - 文本消息: POST https://your-app-url/api/message"
echo "   - 卡片消息: POST https://your-app-url/api/message" 