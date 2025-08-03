#!/bin/bash

# LocalTunnel 警告页面绕过脚本
# 自动处理密码验证

echo "🚀 LocalTunnel 警告页面绕过脚本"
echo "=================================="

# 获取公网 IP
PUBLIC_IP=$(curl -s ifconfig.me)
echo "🌐 您的公网 IP: $PUBLIC_IP"
echo "🔑 LocalTunnel 密码: $PUBLIC_IP"

# 检查 LocalTunnel 是否运行
if ! pgrep -f "localtunnel" > /dev/null; then
    echo "❌ LocalTunnel 未运行，请先启动隧道"
    echo "💡 运行: ./start-localtunnel-simple.sh"
    exit 1
fi

echo ""
echo "📋 解决方案选项："
echo ""

echo "🔧 方案1: 使用 curl 直接访问 API"
echo "--------------------------------"
echo "测试健康检查:"
curl -s https://feishu-webhook.loca.lt/api/health | jq .
echo ""

echo "测试验证端点:"
curl -X POST https://feishu-webhook.loca.lt/api/callback \
  -H "Content-Type: application/json" \
  -d '{"type": "url_verification", "challenge": "test_challenge"}' | jq .
echo ""

echo "🔧 方案2: 使用浏览器访问"
echo "------------------------"
echo "1. 打开浏览器访问: https://feishu-webhook.loca.lt"
echo "2. 在密码输入框中输入: $PUBLIC_IP"
echo "3. 点击 'Continue' 按钮"
echo "4. 现在可以正常访问应用了"
echo ""

echo "🔧 方案3: 使用 Postman 或类似工具"
echo "--------------------------------"
echo "1. 在 Postman 中设置请求头:"
echo "   User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
echo "2. 直接访问 API 端点"
echo ""

echo "🔧 方案4: 配置飞书 Webhook"
echo "--------------------------"
echo "在飞书开发者后台配置以下 URL:"
echo "https://feishu-webhook.loca.lt/api/callback"
echo ""
echo "飞书会自动处理验证，无需手动输入密码"
echo ""

echo "📊 当前状态检查:"
echo "=================="

# 检查健康状态
echo "🏥 健康检查:"
HEALTH_RESPONSE=$(curl -s https://feishu-webhook.loca.lt/api/health)
if echo "$HEALTH_RESPONSE" | grep -q "healthy"; then
    echo "✅ 服务正常运行"
else
    echo "❌ 服务异常"
fi
echo ""

# 检查验证端点
echo "🔐 验证端点:"
VERIFY_RESPONSE=$(curl -s -X POST https://feishu-webhook.loca.lt/api/callback \
  -H "Content-Type: application/json" \
  -d '{"type": "url_verification", "challenge": "test_challenge"}')
if echo "$VERIFY_RESPONSE" | grep -q "challenge"; then
    echo "✅ 验证端点正常"
else
    echo "❌ 验证端点异常"
fi
echo ""

echo "🎯 推荐操作:"
echo "============"
echo "1. 在飞书开发者后台配置 Webhook URL"
echo "2. 使用方案1中的 curl 命令测试功能"
echo "3. 如果需要浏览器访问，使用方案2"
echo ""

echo "💡 提示:"
echo "========"
echo "- LocalTunnel 的密码就是您的公网 IP 地址"
echo "- 飞书等第三方服务会自动处理验证"
echo "- 如果遇到问题，请检查 LocalTunnel 是否正常运行" 