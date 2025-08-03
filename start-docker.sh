#!/bin/bash

# 飞书Webhook服务器Docker启动脚本

echo "🚀 启动飞书Webhook服务器..."

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker未运行，请先启动Docker Desktop"
    exit 1
fi

# 构建镜像
echo "📦 构建Docker镜像..."
docker build -f Dockerfile.simple -t feishu-webhook .

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，尝试使用本地Node.js运行..."
    echo "🔧 使用本地Node.js启动服务..."
    npm start &
    echo "✅ 服务已启动在 http://localhost:3000"
    echo "🧪 测试页面: http://localhost:3000/case"
    echo "🔍 健康检查: http://localhost:3000/api/health"
    exit 0
fi

# 运行容器
echo "🐳 启动Docker容器..."
docker run -d \
  --name feishu-webhook \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  feishu-webhook

if [ $? -eq 0 ]; then
    echo "✅ Docker容器启动成功！"
    echo "🌐 服务地址: http://localhost:3000"
    echo "🧪 测试页面: http://localhost:3000/case"
    echo "🔍 健康检查: http://localhost:3000/api/health"
    
    # 等待服务启动
    echo "⏳ 等待服务启动..."
    sleep 5
    
    # 检查服务状态
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✅ 服务健康检查通过！"
    else
        echo "⚠️  服务可能还在启动中，请稍等..."
    fi
else
    echo "❌ Docker启动失败，使用本地Node.js运行..."
    npm start &
    echo "✅ 本地服务已启动在 http://localhost:3000"
fi

echo ""
echo "📋 管理命令："
echo "  查看日志: docker logs feishu-webhook"
echo "  停止服务: docker stop feishu-webhook"
echo "  重启服务: docker restart feishu-webhook"
echo "  删除容器: docker rm feishu-webhook" 