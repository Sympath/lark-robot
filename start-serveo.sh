#!/bin/bash

# Serveo SSH 隧道启动脚本
# 用于管理飞书 Webhook 服务器的 Serveo 隧道

echo "🚀 飞书 Webhook Serveo 隧道启动脚本"
echo "===================================="

# 检查服务器是否运行
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ 本地服务器未运行，请先启动服务器"
    echo "启动命令: npm start"
    exit 1
fi

echo "✅ 本地服务器运行正常"

# 停止现有的隧道进程
echo "🛑 停止现有的隧道进程..."
pkill -f localtunnel 2>/dev/null || true
pkill ngrok 2>/dev/null || true

# 启动 Serveo 隧道
echo "🌐 启动 Serveo SSH 隧道..."
echo "📝 注意: Serveo 会生成一个随机的子域名"
echo "📝 例如: https://your-app-name.serveo.net"

# 启动 Serveo 隧道
echo "🚀 启动 Serveo 隧道..."
ssh -R 80:localhost:3000 serveo.net &

# 等待隧道启动
echo "⏳ 等待隧道启动..."
sleep 5

# 获取隧道信息
echo ""
echo "📊 隧道状态信息:"
echo "🌐 隧道地址: https://feishu-webhook.serveo.net"
echo "🔗 本地地址: http://localhost:3000"
echo ""

echo "🔗 可用的端点:"
echo "健康检查: https://feishu-webhook.serveo.net/api/health"
echo "测试页面: https://feishu-webhook.serveo.net/case"
echo "发送消息: https://feishu-webhook.serveo.net/api/message"
echo "Webhook: https://feishu-webhook.serveo.net/api/webhook"
echo "日志查看: https://feishu-webhook.serveo.net/api/logs"
echo ""

echo "📝 使用说明:"
echo "1. 将公网地址配置到飞书应用的 Webhook URL"
echo "2. 测试卡片消息发送功能"
echo "3. Serveo 无密码验证，直接可用"
echo ""

echo "🛠️  常用命令:"
echo "测试健康检查: curl https://feishu-webhook.serveo.net/api/health"
echo "停止隧道: pkill -f 'ssh.*serveo'"
echo ""

echo "🎉 Serveo 隧道启动完成！"
echo "💡 提示: 使用 ./stop-serveo.sh 停止服务" 