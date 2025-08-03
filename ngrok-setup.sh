#!/bin/bash

# Ngrok 设置脚本
# 用于管理飞书 Webhook 服务器的 ngrok 隧道

echo "🚀 飞书 Webhook Ngrok 隧道管理脚本"
echo "=================================="

# 检查 ngrok 是否安装
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok 未安装，请先安装 ngrok"
    echo "安装命令: brew install ngrok/ngrok/ngrok"
    exit 1
fi

# 检查服务器是否运行
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ 本地服务器未运行，请先启动服务器"
    echo "启动命令: npm start"
    exit 1
fi

echo "✅ 本地服务器运行正常"

# 获取当前隧道信息
echo ""
echo "📊 当前隧道状态:"
curl -s http://localhost:4040/api/tunnels | python3 -c "
import json
import sys
data = json.load(sys.stdin)
for tunnel in data['tunnels']:
    print(f'🌐 公网地址: {tunnel[\"public_url\"]}')
    print(f'🔗 本地地址: {tunnel[\"config\"][\"addr\"]}')
    print(f'📡 协议: {tunnel[\"proto\"]}')
    print('---')
"

echo ""
echo "🔗 可用的端点:"
echo "健康检查: https://9383bfb9e624.ngrok-free.app/api/health"
echo "测试页面: https://9383bfb9e624.ngrok-free.app/case"
echo "发送消息: https://9383bfb9e624.ngrok-free.app/api/message"
echo "Webhook: https://9383bfb9e624.ngrok-free.app/api/webhook"
echo "日志查看: https://9383bfb9e624.ngrok-free.app/api/logs"

echo ""
echo "📝 使用说明:"
echo "1. 将公网地址配置到飞书应用的 Webhook URL"
echo "2. 测试卡片消息发送功能"
echo "3. 监控 ngrok 控制台: http://localhost:4040"

echo ""
echo "🛠️  常用命令:"
echo "查看隧道状态: curl http://localhost:4040/api/tunnels"
echo "测试健康检查: curl https://9383bfb9e624.ngrok-free.app/api/health"
echo "停止 ngrok: pkill ngrok" 