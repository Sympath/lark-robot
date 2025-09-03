#!/bin/bash

echo "⏹️  正在停止飞书Webhook服务..."

# 停止所有相关进程
pkill -f "node dist/index.js" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "localtunnel" 2>/dev/null || true

# 等待进程完全停止
sleep 2

echo "✅ 所有服务已停止"

# 显示是否还有残留进程
remaining=$(ps aux | grep -E "(node dist/index.js|localtunnel)" | grep -v grep | wc -l)
if [ $remaining -gt 0 ]; then
    echo "⚠️  仍有 $remaining 个相关进程在运行:"
    ps aux | grep -E "(node dist/index.js|localtunnel)" | grep -v grep
else
    echo "🎉 所有服务已完全停止"
fi