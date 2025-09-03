#!/bin/bash

echo "🔄 正在重启飞书Webhook服务..."

# 停止所有相关进程
echo "⏹️  停止现有服务..."
pkill -f "node dist/index.js" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "localtunnel" 2>/dev/null || true

# 等待进程完全停止
sleep 2

# 重新构建项目
echo "🔨 重新构建项目..."
npm run build

# 启动应用服务
echo "🚀 启动应用服务..."
npm start &

# 等待应用启动
sleep 3

# 启动LocalTunnel
echo "🌐 启动LocalTunnel..."
npx localtunnel --port 3000 --subdomain feishu-webhook-new &

# 等待LocalTunnel启动
sleep 3

echo "✅ 服务重启完成！"
echo "📡 Webhook地址: https://feishu-webhook-new.loca.lt/webhook"
echo "💚 健康检查: https://feishu-webhook-new.loca.lt/health"
echo "📝 查看日志: ./view-logs.sh"
echo "📊 实时日志: ./tail-logs.sh"

# 显示进程状态
echo ""
echo "🔍 当前运行的服务:"
ps aux | grep -E "(node dist/index.js|localtunnel)" | grep -v grep