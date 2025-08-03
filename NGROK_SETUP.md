# Ngrok 隧道设置指南

## 概述

本文档说明如何使用 ngrok 将本地飞书 Webhook 服务器暴露到公网，以便飞书应用可以访问。

## 当前状态

✅ **隧道已启动并正常工作**

- **公网地址**: `https://9383bfb9e624.ngrok-free.app`
- **本地地址**: `http://localhost:3000`
- **协议**: HTTPS

## 可用的端点

| 端点 | 地址 | 说明 |
|------|------|------|
| 健康检查 | `https://9383bfb9e624.ngrok-free.app/api/health` | 检查服务状态 |
| 测试页面 | `https://9383bfb9e624.ngrok-free.app/case` | 前端测试界面 |
| 发送消息 | `https://9383bfb9e624.ngrok-free.app/api/message` | 发送文本/卡片消息 |
| Webhook | `https://9383bfb9e624.ngrok-free.app/api/webhook` | 飞书事件回调 |
| 日志查看 | `https://9383bfb9e624.ngrok-free.app/api/logs` | 查看系统日志 |

## 测试结果

所有功能测试通过 ✅

- ✅ 健康检查: 正常
- ✅ 文本消息发送: 正常
- ✅ 卡片消息发送: 正常
- ✅ 日志获取: 正常
- ✅ Webhook端点: 正常

## 配置飞书应用

### 1. 设置 Webhook URL

在飞书开发者后台，将 Webhook URL 设置为：
```
https://9383bfb9e624.ngrok-free.app/api/webhook
```

### 2. 配置事件订阅

确保以下事件已启用：
- `message` - 消息事件
- `interactive` - 卡片交互事件
- `user_added` - 用户加入事件

## 使用方法

### 启动服务

1. 启动本地服务器：
```bash
npm start
```

2. 启动 ngrok 隧道：
```bash
ngrok http 3000
```

3. 运行状态检查：
```bash
./ngrok-setup.sh
```

### 测试功能

1. 测试本地功能：
```bash
node test_functions.js
```

2. 测试 ngrok 隧道：
```bash
node test_ngrok.js
```

### 监控隧道

- **ngrok 控制台**: http://localhost:4040
- **隧道状态**: `curl http://localhost:4040/api/tunnels`

## 常用命令

```bash
# 查看隧道状态
curl http://localhost:4040/api/tunnels

# 测试健康检查
curl https://9383bfb9e624.ngrok-free.app/api/health

# 发送测试消息
curl -X POST https://9383bfb9e624.ngrok-free.app/api/message \
  -H "Content-Type: application/json" \
  -d '{"type": "text", "content": "测试消息"}'

# 停止 ngrok
pkill ngrok
```

## 注意事项

1. **免费版限制**: ngrok 免费版有一些限制，包括：
   - 连接数限制
   - 带宽限制
   - 隧道地址会变化

2. **安全性**: 公网地址可以被任何人访问，请确保：
   - 不要在公网暴露敏感信息
   - 定期检查访问日志

3. **稳定性**: 
   - ngrok 隧道地址可能会变化
   - 需要重新配置飞书应用的 Webhook URL

## 故障排除

### 问题1: 隧道无法访问
```bash
# 检查本地服务是否运行
curl http://localhost:3000/api/health

# 检查 ngrok 是否运行
curl http://localhost:4040/api/tunnels
```

### 问题2: 消息发送失败
```bash
# 检查飞书 SDK 状态
curl http://localhost:3000/api/health

# 查看详细日志
curl http://localhost:3000/api/logs
```

### 问题3: Webhook 回调失败
- 检查飞书应用配置
- 确认 Webhook URL 正确
- 查看服务器日志

## 下一步

1. 将公网地址配置到飞书应用
2. 测试卡片消息发送功能
3. 测试卡片按钮点击功能
4. 监控 ngrok 控制台和服务器日志

---

**当前隧道地址**: `https://9383bfb9e624.ngrok-free.app`

请将此地址配置到您的飞书应用中！ 