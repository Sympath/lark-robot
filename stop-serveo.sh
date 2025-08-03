#!/bin/bash

# Serveo 隧道停止脚本
# 用于停止飞书 Webhook 服务器的 Serveo 隧道

echo "🛑 停止飞书 Webhook Serveo 隧道服务"
echo "===================================="

# 停止 Serveo 隧道
echo "🌐 停止 Serveo 隧道..."
pkill -f "ssh.*serveo" 2>/dev/null || echo "⚠️  没有找到运行中的 serveo 进程"

# 停止本地服务器
echo "🖥️  停止本地服务器..."
pkill -f "node dist/index.js" 2>/dev/null || echo "⚠️  没有找到运行中的服务器进程"

# 检查端口状态
echo "🔍 检查端口状态..."
if lsof -i :3000 > /dev/null 2>&1; then
    echo "❌ 端口 3000 仍被占用"
else
    echo "✅ 端口 3000 已释放"
fi

echo ""
echo "🎉 所有服务已停止"
echo "💡 提示: 使用 ./start-serveo.sh 重新启动服务" 