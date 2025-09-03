#!/bin/bash

# 停止飞书Webhook服务器和Nginx反向代理
# 使用方法: ./stop-with-nginx.sh

echo "🛑 停止飞书Webhook服务器和Nginx反向代理..."

# 停止Nginx
echo "🌐 停止Nginx..."
sudo nginx -s stop 2>/dev/null || echo "Nginx未运行或已停止"

# 停止应用服务器
if [ -f ".app.pid" ]; then
    APP_PID=$(cat .app.pid)
    echo "🎯 停止应用服务器 (PID: $APP_PID)..."
    kill $APP_PID 2>/dev/null || echo "应用服务器未运行或已停止"
    rm -f .app.pid
else
    echo "🎯 查找并停止应用服务器..."
    # 查找运行在3000端口的进程
    PID=$(lsof -ti:3000 2>/dev/null || true)
    if [ ! -z "$PID" ]; then
        echo "找到运行在3000端口的进程 (PID: $PID)，正在停止..."
        kill $PID 2>/dev/null || true
    else
        echo "未找到运行在3000端口的进程"
    fi
fi

echo "✅ 所有服务已停止"