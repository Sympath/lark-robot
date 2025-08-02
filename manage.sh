#!/bin/bash

# 飞书 Webhook 服务器管理脚本

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示帮助信息
show_help() {
    echo -e "${BLUE}飞书 Webhook 服务器管理脚本${NC}"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start     启动服务"
    echo "  stop      停止服务"
    echo "  restart   重启服务"
    echo "  status    查看服务状态"
    echo "  logs      查看日志"
    echo "  build     构建项目"
    echo "  deploy    部署项目"
    echo "  clean     清理项目"
    echo "  help      显示此帮助信息"
    echo ""
}

# 启动服务
start_services() {
    echo -e "${GREEN}🚀 启动服务...${NC}"
    docker-compose up -d
    echo -e "${GREEN}✅ 服务已启动${NC}"
}

# 停止服务
stop_services() {
    echo -e "${YELLOW}🛑 停止服务...${NC}"
    docker-compose down
    echo -e "${GREEN}✅ 服务已停止${NC}"
}

# 重启服务
restart_services() {
    echo -e "${BLUE}🔄 重启服务...${NC}"
    docker-compose restart
    echo -e "${GREEN}✅ 服务已重启${NC}"
}

# 查看服务状态
show_status() {
    echo -e "${BLUE}📊 服务状态:${NC}"
    docker-compose ps
    
    echo -e "\n${BLUE}🏥 健康检查:${NC}"
    curl -s http://localhost/api/health | jq . || echo "健康检查失败"
}

# 查看日志
show_logs() {
    echo -e "${BLUE}📋 查看日志:${NC}"
    docker-compose logs -f --tail=100
}

# 构建项目
build_project() {
    echo -e "${BLUE}🔨 构建项目...${NC}"
    npm install
    npm run build
    echo -e "${GREEN}✅ 项目构建完成${NC}"
}

# 部署项目
deploy_project() {
    echo -e "${BLUE}🚀 部署项目...${NC}"
    ./deploy.sh
}

# 清理项目
clean_project() {
    echo -e "${YELLOW}🧹 清理项目...${NC}"
    docker-compose down -v
    docker system prune -f
    rm -rf dist
    rm -rf node_modules
    echo -e "${GREEN}✅ 项目清理完成${NC}"
}

# 主逻辑
case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    build)
        build_project
        ;;
    deploy)
        deploy_project
        ;;
    clean)
        clean_project
        ;;
    help|*)
        show_help
        ;;
esac 