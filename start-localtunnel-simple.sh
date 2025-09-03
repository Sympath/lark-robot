#!/bin/bash

# 简化的 LocalTunnel 启动脚本
# 自动显示密码信息

echo "🚀 飞书 Webhook LocalTunnel 简化启动脚本"
echo "=========================================="

# 获取公网 IP
PUBLIC_IP=$(curl -s ifconfig.me)
echo "🌐 您的公网 IP: $PUBLIC_IP"
echo "🔑 LocalTunnel 密码: $PUBLIC_IP"
echo ""

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

# 启动 LocalTunnel
echo "🌐 启动 LocalTunnel..."
echo "📝 隧道地址: https://feishu-webhook-new.loca.lt"
echo "🔑 访问密码: $PUBLIC_IP"
echo ""

# 启动 LocalTunnel
echo "🚀 启动 LocalTunnel 隧道..."
npx localtunnel --port 3000 --subdomain feishu-webhook-new &

# 等待隧道启动
echo "⏳ 等待隧道启动..."
sleep 3

echo ""
echo "📊 隧道信息:"
echo "🌐 隧道地址: https://feishu-webhook-new.loca.lt"
echo "🔑 访问密码: $PUBLIC_IP"
echo "🔗 本地地址: http://localhost:3000"
echo ""

echo "🔗 可用的端点:"
echo "健康检查: https://feishu-webhook-new.loca.lt/health"
echo "Webhook: https://feishu-webhook-new.loca.lt/webhook"
echo ""

echo "📝 使用说明:"
echo "1. 访问 https://feishu-webhook-new.loca.lt"
echo "2. 输入密码: $PUBLIC_IP"
echo "3. 将地址配置到飞书应用"
echo "4. 测试功能"
echo ""

echo "🛠️  常用命令:"
echo "测试健康检查: curl https://feishu-webhook-new.loca.lt/health"
echo "停止隧道: pkill -f 'localtunnel'"
echo ""

echo "🎉 LocalTunnel 启动完成！"
echo "💡 提示: 使用 ./stop-localtunnel.sh 停止服务" 