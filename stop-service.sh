#!/bin/bash

# 停止飞书 Webhook 服务脚本

echo "🛑 停止飞书 Webhook 服务"
echo "========================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 停止 Node.js 服务器
echo -e "${BLUE}🖥️  停止本地服务器...${NC}"
if pkill -f "node dist/index.js"; then
    echo -e "${GREEN}✅ 本地服务器已停止${NC}"
else
    echo -e "${YELLOW}⚠️  没有找到运行中的服务器进程${NC}"
fi

# 停止 ngrok 隧道
echo -e "${BLUE}🌐 停止 ngrok 隧道...${NC}"
if pkill ngrok; then
    echo -e "${GREEN}✅ ngrok 隧道已停止${NC}"
else
    echo -e "${YELLOW}⚠️  没有找到运行中的 ngrok 进程${NC}"
fi

# 等待进程完全停止
sleep 2

# 检查端口是否已释放
echo -e "${BLUE}🔍 检查端口状态...${NC}"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}❌ 端口 3000 仍被占用${NC}"
else
    echo -e "${GREEN}✅ 端口 3000 已释放${NC}"
fi

if lsof -Pi :4040 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${RED}❌ 端口 4040 仍被占用${NC}"
else
    echo -e "${GREEN}✅ 端口 4040 已释放${NC}"
fi

echo -e "\n${GREEN}🎉 所有服务已停止${NC}"
echo -e "${BLUE}💡 提示: 使用 ./start-service.sh 重新启动服务${NC}" 