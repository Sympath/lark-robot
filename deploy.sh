#!/bin/bash

# 飞书Webhook服务器一键部署脚本
# 支持版本号自动递增和服务器同步

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 服务器配置
SERVER_HOST="47.120.11.77"
SERVER_USER="root"
SERVER_PATH="/root/feishu"
CONTAINER_NAME="feishu-webhook"

# 日志函数
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

# 检查本地环境
check_local_env() {
    log_info "检查本地环境..."
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        log_error "git 未安装"
        exit 1
    fi
    
    if [ ! -f "package.json" ]; then
        log_error "当前目录不是项目根目录"
        exit 1
    fi
    
    log_success "本地环境检查通过"
}

# 自动递增版本号
increment_version() {
    log_info "自动递增版本号..."
    
    # 读取当前版本号
    current_version=$(node -p "require('./package.json').version")
    log_info "当前版本: $current_version"
    
    # 解析版本号
    IFS='.' read -ra VERSION_PARTS <<< "$current_version"
    major=${VERSION_PARTS[0]}
    minor=${VERSION_PARTS[1]}
    patch=${VERSION_PARTS[2]}
    
    # 递增补丁版本
    new_patch=$((patch + 1))
    new_version="$major.$minor.$new_patch"
    
    log_info "新版本: $new_version"
    
    # 更新package.json
    node -e "
        const fs = require('fs');
        const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        pkg.version = '$new_version';
        fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    "
    
    # 更新src/index.ts中的版本信息
    sed -i.bak "s/const VERSION = '[^']*'/const VERSION = '$new_version'/" src/index.ts
    sed -i.bak "s/版本信息: v[^<]*/版本信息: v$new_version/" src/components/TestPageServer.tsx
    
    # 清理备份文件
    rm -f src/index.ts.bak src/components/TestPageServer.tsx.bak
    
    log_success "版本号已更新为 $new_version"
}

# 构建项目
build_project() {
    log_info "构建项目..."
    
    # 清理旧的构建文件
    rm -rf dist/
    
    # 安装依赖
    npm install
    
    # 构建项目
    npm run build
    
    if [ $? -eq 0 ]; then
        log_success "项目构建成功"
    else
        log_error "项目构建失败"
        exit 1
    fi
}

# 同步到服务器
sync_to_server() {
    log_info "同步代码到服务器..."
    
    # 使用rsync同步文件
    rsync -avz --exclude node_modules --exclude .git --exclude dist --exclude logs \
        --exclude "*.log" --exclude "tunnel.log" \
        . ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/
    
    if [ $? -eq 0 ]; then
        log_success "代码同步成功"
    else
        log_error "代码同步失败"
        exit 1
    fi
}

# 重启服务器服务
restart_server() {
    log_info "重启服务器服务..."
    
    # SSH到服务器执行重启命令
    ssh ${SERVER_USER}@${SERVER_HOST} << 'EOF'
        cd /root/feishu
        
        # 停止并删除旧容器
        docker stop feishu-webhook 2>/dev/null || true
        docker rm feishu-webhook 2>/dev/null || true
        
        # 重新构建镜像
        docker build --no-cache -t feishu-webhook .
        
        # 启动新容器
        docker run -d --name feishu-webhook -p 3001:3000 -e NODE_ENV=production -e PORT=3000 feishu-webhook
        
        # 等待服务启动
        sleep 5
        
        # 检查服务状态
        if docker ps | grep -q feishu-webhook; then
            echo "✅ 容器启动成功"
        else
            echo "❌ 容器启动失败"
            exit 1
        fi
EOF
    
    if [ $? -eq 0 ]; then
        log_success "服务器服务重启成功"
    else
        log_error "服务器服务重启失败"
        exit 1
    fi
}

# 测试服务
test_service() {
    log_info "测试服务..."
    
    # 等待服务完全启动
    sleep 10
    
    # 测试健康检查
    health_response=$(curl -s -k https://${SERVER_HOST}:3000/api/health 2>/dev/null || echo "FAIL")
    
    if [[ "$health_response" == *"healthy"* ]]; then
        log_success "健康检查通过"
    else
        log_error "健康检查失败"
        return 1
    fi
    
    # 测试消息发送
    message_response=$(curl -s -k -X POST https://${SERVER_HOST}:3000/api/message \
        -H "Content-Type: application/json" \
        -d '{"type":"text","content":"部署脚本测试消息"}' 2>/dev/null || echo "FAIL")
    
    if [[ "$message_response" == *"success"* ]]; then
        log_success "消息发送测试通过"
    else
        log_error "消息发送测试失败"
        return 1
    fi
    
    log_success "服务测试通过"
    return 0
}

# 显示部署信息
show_deployment_info() {
    log_info "部署信息:"
    echo "  🌐 服务器地址: https://${SERVER_HOST}:3000"
    echo "  🧪 测试页面: https://${SERVER_HOST}:3000/case"
    echo "  🔍 健康检查: https://${SERVER_HOST}:3000/api/health"
    echo "  📦 容器名称: ${CONTAINER_NAME}"
    echo "  📁 服务器路径: ${SERVER_PATH}"
}

# 主函数
main() {
    log_info "开始部署飞书Webhook服务器..."
    
    # 检查本地环境
    check_local_env
    
    # 自动递增版本号
    increment_version
    
    # 构建项目
    build_project
    
    # 同步到服务器
    sync_to_server
    
    # 重启服务器服务
    restart_server
    
    # 测试服务
    if test_service; then
        log_success "部署完成！"
        show_deployment_info
    else
        log_error "部署测试失败"
        exit 1
    fi
}

# 显示帮助信息
show_help() {
    echo "飞书Webhook服务器部署脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  -h, --help     显示帮助信息"
    echo "  -v, --version  显示当前版本"
    echo "  --test-only    仅测试服务，不部署"
    echo ""
    echo "示例:"
    echo "  $0              # 完整部署"
    echo "  $0 --test-only  # 仅测试服务"
}

# 仅测试服务
test_only() {
    log_info "仅测试服务..."
    if test_service; then
        log_success "服务测试通过"
        show_deployment_info
    else
        log_error "服务测试失败"
        exit 1
    fi
}

# 显示版本信息
show_version() {
    version=$(node -p "require('./package.json').version")
    echo "当前版本: $version"
}

# 解析命令行参数
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -v|--version)
        show_version
        exit 0
        ;;
    --test-only)
        test_only
        exit 0
        ;;
    "")
        main
        ;;
    *)
        log_error "未知选项: $1"
        show_help
        exit 1
        ;;
esac 