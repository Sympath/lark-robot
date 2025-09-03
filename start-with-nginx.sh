#!/bin/bash

# 飞书Webhook服务器启动脚本（带Nginx反向代理）
# 使用方法: ./start-with-nginx.sh

set -e

echo "🚀 启动飞书Webhook服务器（TypeScript + Nginx反向代理）"

# 检查Node.js和npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 检查nginx
if ! command -v nginx &> /dev/null; then
    echo "❌ Nginx 未安装，请先安装 Nginx"
    echo "macOS: brew install nginx"
    echo "Ubuntu: sudo apt install nginx"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建TypeScript项目
echo "🔨 构建TypeScript项目..."
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败，dist目录不存在"
    exit 1
fi

# 停止可能正在运行的nginx
echo "🛑 停止可能正在运行的Nginx..."
sudo nginx -s stop 2>/dev/null || true

# 启动应用服务器
echo "🎯 启动应用服务器..."
npm run start:prod &
APP_PID=$!

# 等待应用启动
echo "⏳ 等待应用启动..."
sleep 3

# 检查应用是否启动成功
if ! curl -s http://localhost:3000/health > /dev/null; then
    echo "❌ 应用启动失败"
    kill $APP_PID 2>/dev/null || true
    exit 1
fi

echo "✅ 应用服务器启动成功 (PID: $APP_PID)"

# 启动Nginx反向代理
echo "🌐 启动Nginx反向代理..."
sudo nginx -c $(pwd)/nginx.conf

# 检查Nginx是否启动成功
if ! curl -s http://localhost/health > /dev/null; then
    echo "❌ Nginx启动失败"
    sudo nginx -s stop
    kill $APP_PID 2>/dev/null || true
    exit 1
fi

echo "✅ Nginx反向代理启动成功"

# 显示访问信息
echo ""
echo "🎉 服务启动完成！"
echo "📡 Webhook地址: http://localhost/webhook"
echo "💚 健康检查: http://localhost/health"
echo "🔧 应用直接访问: http://localhost:3000"
echo ""
echo "📋 管理命令:"
echo "  停止服务: ./stop-with-nginx.sh"
echo "  查看日志: tail -f /var/log/nginx/access.log"
echo "  重载配置: sudo nginx -s reload"
echo ""

# 保存PID到文件
echo $APP_PID > .app.pid

# 等待用户中断
trap 'echo "🛑 收到中断信号，正在关闭服务..."; sudo nginx -s stop; kill $APP_PID 2>/dev/null || true; rm -f .app.pid; echo "✅ 服务已关闭"; exit 0' INT TERM

echo "按 Ctrl+C 停止服务"
wait $APP_PID