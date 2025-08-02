#!/bin/bash

echo "🔍 正在获取公网地址..."

# 检查本地服务是否运行
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ 本地服务未运行，请先启动服务：npm start"
    exit 1
fi

echo "✅ 本地服务运行正常"

# 尝试使用不同的隧道服务
echo "🌐 尝试建立公网隧道..."

# 方法1: 使用 cloudflared
if command -v cloudflared &> /dev/null; then
    echo "📡 使用 cloudflared 创建隧道..."
    cloudflared tunnel --url http://localhost:3000 &
    CLOUDFLARED_PID=$!
    sleep 5
    
    # 检查 cloudflared 是否成功启动
    if ps -p $CLOUDFLARED_PID > /dev/null; then
        echo "✅ cloudflared 隧道已启动"
        echo "🔗 公网地址: https://your-tunnel-id.trycloudflare.com"
        echo "📱 Webhook URL: https://your-tunnel-id.trycloudflare.com/api/callback"
        echo "🏥 Health Check: https://your-tunnel-id.trycloudflare.com/api/health"
        echo "📝 Logs: https://your-tunnel-id.trycloudflare.com/api/logs"
        echo ""
        echo "💡 请查看 cloudflared 的输出日志获取实际的隧道地址"
        echo "💡 或者访问 https://dash.cloudflare.com/ 查看隧道状态"
    else
        echo "❌ cloudflared 启动失败"
    fi
else
    echo "❌ cloudflared 未安装"
fi

echo ""
echo "🔧 其他选项："
echo "1. 安装 ngrok 并注册免费账户: https://ngrok.com/"
echo "2. 使用 localtunnel: npm install -g localtunnel && lt --port 3000"
echo "3. 使用 serveo: ssh -R 80:localhost:3000 serveo.net"
echo "4. 使用 Cloudflare Tunnel: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/"

echo ""
echo "📋 本地服务信息："
echo "🔗 本地地址: http://localhost:3000"
echo "📱 Webhook URL: http://localhost:3000/api/callback"
echo "🏥 Health Check: http://localhost:3000/api/health"
echo "📝 Logs: http://localhost:3000/api/logs" 