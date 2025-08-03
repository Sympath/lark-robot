# 飞书 Webhook 服务器

基于 TypeScript 和 Express.js 的飞书 Webhook 服务器，支持消息推送、卡片交互和 toast 提醒功能。

## 🚀 快速部署

### 一行命令部署
```bash
./quick-update.sh
```

### 服务管理
```bash
# 查看帮助
./manage.sh help

# 部署服务
./manage.sh deploy-docker

# 更新服务
./manage.sh update-docker

# 查看状态
./manage.sh status

# 健康检查
./manage.sh health
```

## 🌐 服务信息

- **服务地址**: http://47.120.11.77:3000
- **健康检查**: http://47.120.11.77:3000/api/health
- **测试页面**: http://47.120.11.77:3000/case
- **日志查看**: http://47.120.11.77:3000/api/logs

## ✅ 功能状态

| 功能 | 状态 | 说明 |
|------|------|------|
| 文本消息推送 | ✅ 正常 | 可以成功发送文本消息 |
| 卡片消息推送 | ❌ 需要修复 | 卡片格式问题 |
| 交互卡片推送 | ❌ 需要修复 | 卡片格式问题 |
| Toast 提醒 | ✅ 正常 | 点击按钮后发送 toast |
| Web 测试页面 | ✅ 正常 | 可以正常访问和测试 |
| Docker 部署 | ✅ 正常 | 容器化部署成功 |

## 🧪 测试

```bash
# 测试服务功能
./manage.sh test

# 本地测试
node tests/test_case_web.js
```

## 📝 日志文件

- `card_interactions.log` - 卡片交互记录
- `toast_notifications.log` - Toast 提醒记录
- `toast_errors.log` - Toast 错误记录

## 🔧 配置

### 飞书配置
- **App ID**: `cli_a8079e4490b81013`
- **验证 Token**: `YMldy28rYB74elrtcGPVehdT32o0rM0Y`
- **Webhook URL**: `http://47.120.11.77:3000/api/callback`

## 🎉 部署成功

✅ **服务已成功部署到阿里云服务器**
- 使用 Docker 容器化部署
- 支持自动重启和健康检查
- 完整的日志记录和监控 