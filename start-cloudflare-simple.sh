#!/bin/bash

# 简化的 Cloudflare Tunnel 启动脚本
# 使用随机域名，无需配置

echo "🚀 飞书 Webhook Cloudflare Tunnel 简化启动脚本"
echo "=============================================="

# 检查 cloudflared 是否安装
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared 未安装，请先安装 Cloudflare Tunnel"
    echo "安装命令: brew install cloudflare/cloudflare/cloudflared"
    exit 1
fi

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
pkill -f "ssh.*serveo" 2>/dev/null || true
pkill cloudflared 2>/dev/null || true

# 启动 Cloudflare Tunnel
echo "🌐 启动 Cloudflare Tunnel..."
echo "📝 注意: 首次运行可能需要登录 Cloudflare 账户"
echo "📝 登录命令: cloudflared tunnel login"

# 启动 Cloudflare Tunnel (使用随机域名)
echo "🚀 启动 Cloudflare Tunnel 隧道..."
cloudflared tunnel --url http://localhost:3000 &

# 等待隧道启动
echo "⏳ 等待隧道启动..."
sleep 5

# 获取隧道信息
echo ""
echo "📊 隧道状态信息:"
echo "🌐 隧道地址: 请查看上面的输出获取随机域名"
echo "🔗 本地地址: http://localhost:3000"
echo ""

echo "🔗 可用的端点:"
echo "健康检查: [随机域名]/api/health"
echo "测试页面: [随机域名]/case"
echo "发送消息: [随机域名]/api/message"
echo "Webhook: [随机域名]/api/webhook"
echo "日志查看: [随机域名]/api/logs"
echo ""

echo "📝 使用说明:"
echo "1. 查看上面的输出获取随机域名"
echo "2. 将公网地址配置到飞书应用的 Webhook URL"
echo "3. 测试卡片消息发送功能"
echo "4. Cloudflare Tunnel 无密码验证，直接可用"
echo ""

echo "🛠️  常用命令:"
echo "停止隧道: pkill cloudflared"
echo ""

echo "🎉 Cloudflare Tunnel 启动完成！"
echo "💡 提示: 使用 ./stop-cloudflare.sh 停止服务" 