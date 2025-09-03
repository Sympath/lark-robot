#!/bin/bash

# 启动使用 EventDispatcher 的飞书 Webhook 服务
# 配置反向代理到 https://feishu-webhook.loca.lt/api/callback

echo "🚀 启动飞书 Webhook EventDispatcher 服务"
echo "=========================================="

# 设置环境变量
export FEISHU_ENCRYPT_KEY="qsJboodT6Or4STWCp9DqHfbwWrG5TqPb"
export FEISHU_VERIFICATION_TOKEN="glqekPS9pO55cF0bHfSEZbogArkR8inu"
export FEISHU_APP_ID="cli_a8079e4490b81013"
export FEISHU_APP_SECRET="GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI"

# 启用加密和验证
export ENABLE_ENCRYPTION="true"
export ENABLE_TOKEN_VALIDATION="true"
export ENABLE_SIGNATURE_VALIDATION="false"
export ENABLE_REQUEST_LOGGING="true"

echo "🔧 环境变量配置:"
echo "   FEISHU_ENCRYPT_KEY: $FEISHU_ENCRYPT_KEY"
echo "   FEISHU_VERIFICATION_TOKEN: $FEISHU_VERIFICATION_TOKEN"
echo "   ENABLE_ENCRYPTION: $ENABLE_ENCRYPTION"
echo "   ENABLE_TOKEN_VALIDATION: $ENABLE_TOKEN_VALIDATION"
echo ""

# 检查 Node.js 和 npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"
echo ""

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist 目录不存在"
    exit 1
fi

echo "✅ 构建成功"
echo ""

# 启动服务
echo "🚀 启动服务..."
echo "📍 服务地址: http://localhost:3000"
echo "🔗 回调端点: http://localhost:3000/api/callback"
echo "🧪 测试页面: http://localhost:3000/case"
echo "🏥 健康检查: http://localhost:3000/api/health"
echo ""

# 启动 LocalTunnel（如果未运行）
if ! pgrep -f "localtunnel" > /dev/null; then
    echo "🌐 启动 LocalTunnel..."
    npx localtunnel --port 3000 --subdomain feishu-webhook &
    sleep 5
    echo "✅ LocalTunnel 已启动: https://feishu-webhook.loca.lt"
    echo ""
fi

# 启动应用
echo "🎯 启动应用服务..."
npm start