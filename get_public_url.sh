#!/bin/bash

echo "🌐 正在获取公网地址..."

# 检查本地服务是否运行
if ! curl -s http://localhost:3000/api/health > /dev/null; then
    echo "❌ 本地服务未运行，请先启动服务：npm start"
    exit 1
fi

echo "✅ 本地服务运行正常"

# 启动 cloudflared 隧道
echo "🚀 启动 cloudflared 隧道..."
cloudflared tunnel --url http://localhost:3000 > tunnel.log 2>&1 &
TUNNEL_PID=$!

# 等待隧道启动
echo "⏳ 等待隧道启动..."
sleep 5

# 检查隧道是否启动成功
if ! ps -p $TUNNEL_PID > /dev/null; then
    echo "❌ 隧道启动失败"
    exit 1
fi

echo "✅ 隧道启动成功，PID: $TUNNEL_PID"

# 从日志中提取公网地址
echo "🔍 获取公网地址..."
sleep 3

PUBLIC_URL=$(grep -o "https://[a-zA-Z0-9.-]*\.trycloudflare\.com" tunnel.log | head -1)

if [ -n "$PUBLIC_URL" ]; then
    echo ""
    echo "🎉 公网地址获取成功！"
    echo "🌐 公网地址: $PUBLIC_URL"
    echo ""
    echo "📋 飞书 Webhook 配置:"
    echo "   Webhook URL: $PUBLIC_URL/api/callback"
    echo "   验证 Token: YMldy28rYB74elrtcGPVehdT32o0rM0Y"
    echo ""
    echo "🔧 测试命令:"
    echo "   curl -X GET $PUBLIC_URL/api/health"
    echo "   curl -X PUT $PUBLIC_URL/api/message"
    echo ""
    echo "💡 提示：将此地址配置到飞书开放平台的事件订阅中"
else
    echo "❌ 无法获取公网地址，请检查 tunnel.log 文件"
    cat tunnel.log
fi

echo ""
echo "🛑 停止隧道请运行: pkill cloudflared" 