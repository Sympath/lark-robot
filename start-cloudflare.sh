#!/bin/bash

# Cloudflare Tunnel 启动脚本
# 用于管理飞书 Webhook 服务器的 Cloudflare Tunnel

echo "🚀 飞书 Webhook Cloudflare Tunnel 启动脚本"
echo "=========================================="

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

# 停止现有的 ngrok 进程
echo "🛑 停止现有的 ngrok 进程..."
pkill ngrok 2>/dev/null || true

# 启动 Cloudflare Tunnel
echo "🌐 启动 Cloudflare Tunnel..."
echo "📝 注意: 首次运行需要登录 Cloudflare 账户"
echo "📝 登录命令: cloudflared tunnel login"

# 创建隧道配置文件
cat > tunnel.yml << EOF
tunnel: feishu-webhook
credentials-file: ~/.cloudflared/feishu-webhook.json

ingress:
  - hostname: feishu-webhook.your-domain.com
    service: http://localhost:3000
  - service: http_status:404
EOF

# 启动隧道
echo "🚀 启动 Cloudflare Tunnel..."
cloudflared tunnel --config tunnel.yml run feishu-webhook &

# 等待隧道启动
echo "⏳ 等待隧道启动..."
sleep 5

# 获取隧道信息
echo ""
echo "📊 隧道状态信息:"
cloudflared tunnel info feishu-webhook 2>/dev/null || echo "⚠️  隧道信息获取失败，可能需要先创建隧道"

echo ""
echo "🔗 可用的端点:"
echo "健康检查: https://feishu-webhook.your-domain.com/api/health"
echo "测试页面: https://feishu-webhook.your-domain.com/case"
echo "发送消息: https://feishu-webhook.your-domain.com/api/message"
echo "Webhook: https://feishu-webhook.your-domain.com/api/webhook"
echo "日志查看: https://feishu-webhook.your-domain.com/api/logs"

echo ""
echo "📝 使用说明:"
echo "1. 将公网地址配置到飞书应用的 Webhook URL"
echo "2. 测试卡片消息发送功能"
echo "3. 监控 Cloudflare Tunnel 状态"

echo ""
echo "🛠️  常用命令:"
echo "查看隧道状态: cloudflared tunnel info feishu-webhook"
echo "测试健康检查: curl https://feishu-webhook.your-domain.com/api/health"
echo "停止隧道: pkill cloudflared"

echo ""
echo "🎉 Cloudflare Tunnel 启动完成！"
echo "💡 提示: 使用 ./stop-cloudflare.sh 停止服务" 