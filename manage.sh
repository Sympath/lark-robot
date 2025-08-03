#!/bin/bash

# 飞书 Webhook 服务器管理脚本

set -e

# 配置信息
REMOTE_HOST="47.120.11.77"
REMOTE_USER="root"
REMOTE_PASSWORD="Wzyuan042200"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 显示帮助信息
show_help() {
    echo "飞书 Webhook 服务器管理脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  deploy    部署服务到服务器 (PM2)"
    echo "  deploy-docker  部署服务到服务器 (Docker)"
    echo "  update    更新服务 (构建+上传+重启)"
    echo "  update-docker  更新服务 (Docker)"
    echo "  start     启动服务"
    echo "  stop      停止服务"
    echo "  restart   重启服务"
    echo "  status    查看服务状态"
    echo "  logs      查看服务日志"
    echo "  health    健康检查"
    echo "  test      测试服务"
    echo "  help      显示帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 deploy-docker  # Docker 部署"
    echo "  $0 update-docker  # Docker 更新"
    echo "  $0 status         # 查看状态"
    echo "  $0 logs           # 查看日志"
}

# 执行远程命令
remote_exec() {
    sshpass -p "$REMOTE_PASSWORD" ssh -o StrictHostKeyChecking=no "$REMOTE_USER@$REMOTE_HOST" "$1"
}

# 部署服务 (PM2)
deploy() {
    log_info "开始部署服务 (PM2)..."
    chmod +x deploy.sh
    ./deploy.sh
}

# 部署服务 (Docker)
deploy_docker() {
    log_info "开始部署服务 (Docker)..."
    chmod +x docker-deploy.sh
    ./docker-deploy.sh
}

# 更新服务 (PM2)
update() {
    log_info "开始更新服务 (PM2)..."
    chmod +x update.sh
    ./update.sh
}

# 更新服务 (Docker)
update_docker() {
    log_info "开始更新服务 (Docker)..."
    npm run build
    chmod +x docker-deploy.sh
    ./docker-deploy.sh
}

# 启动服务
start() {
    log_info "启动服务..."
    remote_exec "cd /opt/feishu-webhook && docker-compose up -d || pm2 start feishu-webhook"
    log_success "服务启动完成"
}

# 停止服务
stop() {
    log_info "停止服务..."
    remote_exec "cd /opt/feishu-webhook && docker-compose down || pm2 stop feishu-webhook"
    log_success "服务停止完成"
}

# 重启服务
restart() {
    log_info "重启服务..."
    remote_exec "cd /opt/feishu-webhook && docker-compose restart || pm2 restart feishu-webhook"
    log_success "服务重启完成"
}

# 查看服务状态
status() {
    log_info "查看服务状态..."
    remote_exec "cd /opt/feishu-webhook && docker-compose ps || pm2 list"
    echo ""
    log_info "服务信息:"
    echo "🌐 服务地址: http://47.120.11.77:3000"
    echo "📊 健康检查: http://47.120.11.77:3000/api/health"
    echo "🧪 测试页面: http://47.120.11.77:3000/case"
}

# 查看服务日志
logs() {
    log_info "查看服务日志..."
    remote_exec "cd /opt/feishu-webhook && docker-compose logs --tail=20 || pm2 logs feishu-webhook --lines 20"
}

# 健康检查
health() {
    log_info "执行健康检查..."
    response=$(curl -s -o /dev/null -w "%{http_code}" http://47.120.11.77:3000/api/health || echo "000")
    if [ "$response" = "200" ]; then
        log_success "服务健康检查通过"
        curl -s http://47.120.11.77:3000/api/health | jq . 2>/dev/null || curl -s http://47.120.11.77:3000/api/health
    else
        log_error "服务健康检查失败 (HTTP $response)"
    fi
}

# 测试服务
test() {
    log_info "测试服务功能..."
    
    # 测试健康检查
    echo "1. 测试健康检查..."
    health
    
    # 测试文本消息推送
    echo ""
    echo "2. 测试文本消息推送..."
    response=$(curl -s -X POST http://47.120.11.77:3000/api/case/text \
        -H "Content-Type: application/json" \
        -d '{"receive_id": "oc_e55d91081dddae90bd877294a437ed2e", "receive_id_type": "chat_id"}' \
        -w "%{http_code}" -o /tmp/test_response.json)
    
    if [ "$response" = "200" ]; then
        log_success "文本消息推送测试通过"
        cat /tmp/test_response.json | jq . 2>/dev/null || cat /tmp/test_response.json
    else
        log_error "文本消息推送测试失败 (HTTP $response)"
        cat /tmp/test_response.json 2>/dev/null || echo "无响应内容"
    fi
    
    # 清理临时文件
    rm -f /tmp/test_response.json
}

# 主函数
main() {
    case "${1:-help}" in
        deploy)
            deploy
            ;;
        deploy-docker)
            deploy_docker
            ;;
        update)
            update
            ;;
        update-docker)
            update_docker
            ;;
        start)
            start
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        status)
            status
            ;;
        logs)
            logs
            ;;
        health)
            health
            ;;
        test)
            test
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 检查依赖
check_dependencies() {
    if ! command -v sshpass &> /dev/null; then
        log_error "sshpass 未安装，请先安装: brew install sshpass (macOS) 或 apt-get install sshpass (Ubuntu)"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null; then
        log_error "curl 未安装"
        exit 1
    fi
}

# 执行主函数
check_dependencies
main "$@" 