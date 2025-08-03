#!/bin/bash

# 飞书 Webhook 服务启动脚本
# 包含本地服务器和 ngrok 隧道

echo "🚀 飞书 Webhook 服务启动脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查依赖
check_dependencies() {
    echo -e "${BLUE}🔍 检查依赖...${NC}"
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm 未安装${NC}"
        exit 1
    fi
    
    # 检查 ngrok
    if ! command -v ngrok &> /dev/null; then
        echo -e "${YELLOW}⚠️  ngrok 未安装，将跳过隧道启动${NC}"
        NGROK_AVAILABLE=false
    else
        NGROK_AVAILABLE=true
    fi
    
    echo -e "${GREEN}✅ 依赖检查完成${NC}"
}

# 构建项目
build_project() {
    echo -e "${BLUE}🔨 构建项目...${NC}"
    
    if npm run build; then
        echo -e "${GREEN}✅ 构建成功${NC}"
    else
        echo -e "${RED}❌ 构建失败${NC}"
        exit 1
    fi
}

# 启动本地服务器
start_server() {
    echo -e "${BLUE}🖥️  启动本地服务器...${NC}"
    
    # 检查端口是否被占用
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  端口 3000 已被占用，正在停止现有进程...${NC}"
        pkill -f "node dist/index.js"
        sleep 2
    fi
    
    # 启动服务器
    npm start &
    SERVER_PID=$!
    
    # 等待服务器启动
    echo -e "${BLUE}⏳ 等待服务器启动...${NC}"
    for i in {1..10}; do
        if curl -s http://localhost:3000/api/health > /dev/null; then
            echo -e "${GREEN}✅ 服务器启动成功 (PID: $SERVER_PID)${NC}"
            return 0
        fi
        sleep 1
    done
    
    echo -e "${RED}❌ 服务器启动失败${NC}"
    exit 1
}

# 启动 ngrok 隧道
start_ngrok() {
    if [ "$NGROK_AVAILABLE" = false ]; then
        echo -e "${YELLOW}⚠️  跳过 ngrok 启动（未安装）${NC}"
        return 0
    fi
    
    echo -e "${BLUE}🌐 启动 ngrok 隧道...${NC}"
    
    # 检查 ngrok 是否已运行
    if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  ngrok 已在运行${NC}"
        return 0
    fi
    
    # 启动 ngrok
    ngrok http 3000 > /dev/null 2>&1 &
    NGROK_PID=$!
    
    # 等待隧道启动
    echo -e "${BLUE}⏳ 等待隧道启动...${NC}"
    for i in {1..10}; do
        if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
            echo -e "${GREEN}✅ ngrok 隧道启动成功 (PID: $NGROK_PID)${NC}"
            return 0
        fi
        sleep 1
    done
    
    echo -e "${YELLOW}⚠️  ngrok 隧道启动可能失败，但继续运行${NC}"
}

# 显示状态信息
show_status() {
    echo -e "\n${BLUE}📊 服务状态信息:${NC}"
    echo "================================"
    
    # 服务器状态
    if curl -s http://localhost:3000/api/health > /dev/null; then
        echo -e "${GREEN}✅ 本地服务器: 运行中 (http://localhost:3000)${NC}"
    else
        echo -e "${RED}❌ 本地服务器: 未运行${NC}"
    fi
    
    # ngrok 状态
    if [ "$NGROK_AVAILABLE" = true ]; then
        if curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
            TUNNEL_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import json, sys; data = json.load(sys.stdin); print(data['tunnels'][0]['public_url'])" 2>/dev/null)
            echo -e "${GREEN}✅ ngrok 隧道: 运行中 (${TUNNEL_URL})${NC}"
        else
            echo -e "${RED}❌ ngrok 隧道: 未运行${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  ngrok 隧道: 未安装${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🔗 可用的端点:${NC}"
    echo "本地健康检查: http://localhost:3000/api/health"
    echo "本地测试页面: http://localhost:3000/case"
    if [ "$NGROK_AVAILABLE" = true ] && curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
        TUNNEL_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import json, sys; data = json.load(sys.stdin); print(data['tunnels'][0]['public_url'])" 2>/dev/null)
        echo "公网健康检查: ${TUNNEL_URL}/api/health"
        echo "公网测试页面: ${TUNNEL_URL}/case"
        echo "公网 Webhook: ${TUNNEL_URL}/api/webhook"
    fi
    
    echo ""
    echo -e "${BLUE}🛠️  管理命令:${NC}"
    echo "查看服务器日志: tail -f tunnel.log"
    echo "查看 ngrok 控制台: http://localhost:4040"
    echo "停止所有服务: ./stop-service.sh"
    echo "测试功能: node test_functions.js"
    echo "测试 ngrok: node test_ngrok.js"
}

# 主函数
main() {
    check_dependencies
    build_project
    start_server
    start_ngrok
    show_status
    
    echo -e "\n${GREEN}🎉 服务启动完成！${NC}"
    echo -e "${YELLOW}💡 提示: 使用 Ctrl+C 停止服务${NC}"
    
    # 保持脚本运行
    wait
}

# 捕获 Ctrl+C
trap 'echo -e "\n${YELLOW}正在停止服务...${NC}"; pkill -f "node dist/index.js"; pkill ngrok; echo -e "${GREEN}服务已停止${NC}"; exit 0' INT

# 运行主函数
main 