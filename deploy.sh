#!/bin/bash

# 飞书 Webhook 服务器部署脚本

set -e

echo "🚀 开始部署飞书 Webhook 服务器..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

# 检查 Docker Compose 是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建必要的目录
echo "📁 创建必要的目录..."
mkdir -p logs/nginx
mkdir -p ssl

# 停止现有容器
echo "🛑 停止现有容器..."
docker-compose down || true

# 构建并启动服务
echo "🔨 构建并启动服务..."
docker-compose up -d --build

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 30

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose ps

# 检查健康状态
echo "🏥 检查健康状态..."
curl -f http://localhost/api/health || {
    echo "❌ 服务健康检查失败"
    docker-compose logs
    exit 1
}

echo "✅ 部署完成！"
echo "📱 Webhook URL: http://47.120.11.77/api/callback"
echo "🏥 Health Check: http://47.120.11.77/api/health"
echo "📝 Logs: http://47.120.11.77/api/logs"

# 显示日志
echo "📋 显示最近日志..."
docker-compose logs --tail=50 