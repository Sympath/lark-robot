#!/bin/bash

# LocalTunnel 启动脚本
# 用于管理飞书 Webhook 服务器的 LocalTunnel

echo "🚀 飞书 Webhook LocalTunnel 启动脚本"
echo "===================================="

# 检查 npx 是否可用
if ! command -v npx &> /dev/null; then
    echo "❌ npx 不可用，请检查 Node.js 安装"
    exit 1
fi

# 检查服务器是否运行
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ 本地服务器未运行，请先启动服务器"
    echo "启动命令: npm start"
    exit 1
fi

echo "✅ 本地服务器运行正常"

# 停止现有的 ngrok 进程
echo "🛑 停止现有的 ngrok 进程..."
pkill ngrok 2>/dev/null || true

# 启动 LocalTunnel
echo "🌐 启动 LocalTunnel..."
echo "📝 注意: LocalTunnel 会生成一个随机的子域名"
echo "📝 例如: https://your-app-name.loca.lt"

# 启动 LocalTunnel
echo "🚀 启动 LocalTunnel 隧道..."
npx localtunnel --port 3000 --subdomain feishu-webhook &

# 等待隧道启动
echo "⏳ 等待隧道启动..."
sleep 3

# 获取隧道 URL
echo ""
echo "📊 隧道状态信息:"
echo "🌐 隧道地址: https://feishu-webhook.loca.lt"
echo "🔗 本地地址: http://localhost:3000"

echo ""
echo "🔗 可用的端点:"
echo "健康检查: https://feishu-webhook.loca.lt/api/health"
echo "测试页面: https://feishu-webhook.loca.lt/case"
echo "发送消息: https://feishu-webhook.loca.lt/api/message"
echo "Webhook: https://feishu-webhook.loca.lt/api/webhook"
echo "日志查看: https://feishu-webhook.loca.lt/api/logs"

echo ""
echo "📝 使用说明:"
echo "1. 将公网地址配置到飞书应用的 Webhook URL"
echo "2. 测试卡片消息发送功能"
echo "3. LocalTunnel 无警告页面，直接可用"

echo ""
echo "🛠️  常用命令:"
echo "测试健康检查: curl https://feishu-webhook.loca.lt/api/health"
echo "停止隧道: pkill -f 'localtunnel'"

echo ""
echo "🎉 LocalTunnel 启动完成！"
echo "💡 提示: 使用 ./stop-localtunnel.sh 停止服务" 