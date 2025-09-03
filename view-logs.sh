#!/bin/bash

# 查看飞书Webhook服务器日志的脚本

echo "🔍 飞书Webhook服务器日志查看器"
echo "=================================="

# 检查日志目录是否存在
if [ ! -d "logs" ]; then
    echo "❌ 日志目录不存在，请先启动服务"
    exit 1
fi

echo "✅ 日志目录存在"
echo ""

# 显示日志文件信息
echo "📊 日志文件信息:"
echo "应用日志: logs/app.log"
echo "错误日志: logs/error.log"
echo ""

# 显示日志文件大小
if [ -f "logs/app.log" ]; then
    APP_SIZE=$(du -h logs/app.log | cut -f1)
    echo "应用日志大小: $APP_SIZE"
fi

if [ -f "logs/error.log" ]; then
    ERROR_SIZE=$(du -h logs/error.log | cut -f1)
    echo "错误日志大小: $ERROR_SIZE"
fi

echo ""

# 显示最近的日志
echo "📝 最近的日志输出 (最后20行):"
echo "-------------------"

if [ -f "logs/app.log" ]; then
    echo "🔵 应用日志:"
    tail -20 logs/app.log
    echo ""
fi

if [ -f "logs/error.log" ]; then
    echo "🔴 错误日志:"
    tail -20 logs/error.log
    echo ""
fi

echo "💡 查看日志的命令:"
echo ""
echo "实时查看应用日志:"
echo "  tail -f logs/app.log"
echo ""
echo "实时查看错误日志:"
echo "  tail -f logs/error.log"
echo ""
echo "查看所有日志:"
echo "  tail -f logs/*.log"
echo ""
echo "搜索特定内容:"
echo "  grep 'challenge' logs/app.log"
echo "  grep 'ERROR' logs/error.log"
echo ""

# 显示服务状态
echo "🌐 服务状态:"
if lsof -i :3000 > /dev/null 2>&1; then
    echo "✅ 应用服务器正在运行"
    echo "Webhook地址: https://feishu-webhook-new.loca.lt/webhook"
    echo "健康检查: https://feishu-webhook-new.loca.lt/health"
else
    echo "❌ 应用服务器未运行"
fi