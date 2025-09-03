#!/bin/bash

# 重启服务并显示日志的脚本

echo "🔄 重启飞书Webhook服务器并显示日志"
echo "=================================="

# 停止现有服务
echo "🛑 停止现有服务..."
kill $(lsof -ti:3000) 2>/dev/null || true
pkill -f localtunnel 2>/dev/null || true

# 等待服务完全停止
sleep 2

# 重新构建
echo "🔨 重新构建项目..."
npm run build

# 启动应用（前台运行，显示日志）
echo "🚀 启动应用服务器..."
npm start &
APP_PID=$!

# 等待应用启动
sleep 3

# 启动LocalTunnel
echo "🌐 启动LocalTunnel..."
npx localtunnel --port 3000 --subdomain feishu-webhook-new &
TUNNEL_PID=$!

# 等待隧道启动
sleep 5

echo ""
echo "✅ 服务已启动！"
echo "📡 Webhook地址: https://feishu-webhook-new.loca.lt/webhook"
echo "💚 健康检查: https://feishu-webhook-new.loca.lt/health"
echo ""
echo "📝 实时日志输出:"
echo "=================="

# 保存PID
echo $APP_PID > .app.pid
echo $TUNNEL_PID > .tunnel.pid

# 等待用户中断
trap 'echo ""; echo "🛑 收到中断信号，正在关闭服务..."; kill $APP_PID 2>/dev/null || true; kill $TUNNEL_PID 2>/dev/null || true; rm -f .app.pid .tunnel.pid; echo "✅ 服务已关闭"; exit 0' INT TERM

echo "按 Ctrl+C 停止服务并退出"
echo ""

# 等待应用进程
wait $APP_PID