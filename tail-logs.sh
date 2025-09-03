#!/bin/bash

# 实时查看日志的脚本

echo "📺 实时查看飞书Webhook服务器日志"
echo "=================================="

# 检查日志目录是否存在
if [ ! -d "logs" ]; then
    echo "❌ 日志目录不存在，请先启动服务"
    exit 1
fi

echo "✅ 开始实时查看日志..."
echo "按 Ctrl+C 退出"
echo ""

# 同时查看应用日志和错误日志
if [ -f "logs/app.log" ] && [ -f "logs/error.log" ]; then
    echo "🔵 应用日志 + 🔴 错误日志:"
    tail -f logs/app.log logs/error.log
elif [ -f "logs/app.log" ]; then
    echo "🔵 应用日志:"
    tail -f logs/app.log
elif [ -f "logs/error.log" ]; then
    echo "🔴 错误日志:"
    tail -f logs/error.log
else
    echo "❌ 没有找到日志文件"
    exit 1
fi