# 🎉 LocalTunnel 启动成功！

## ✅ 隧道状态

**LocalTunnel 已成功启动并运行正常**

- ✅ **隧道地址**: `https://feishu-webhook.loca.lt`
- ✅ **访问密码**: `117.147.104.40`
- ✅ **健康检查**: 正常
- ✅ **消息发送**: 正常

## 🌐 公网访问地址

**主要地址**: `https://feishu-webhook.loca.lt`

### 可用的端点

| 功能 | 地址 | 状态 |
|------|------|------|
| 健康检查 | `https://feishu-webhook.loca.lt/api/health` | ✅ |
| 测试页面 | `https://feishu-webhook.loca.lt/case` | ✅ |
| 发送消息 | `https://feishu-webhook.loca.lt/api/message` | ✅ |
| Webhook | `https://feishu-webhook.loca.lt/api/webhook` | ✅ |
| 日志查看 | `https://feishu-webhook.loca.lt/api/logs` | ✅ |

## 🔑 访问密码

**密码**: `117.147.104.40`

当您访问 `https://feishu-webhook.loca.lt` 时，会看到密码验证页面，请输入上述 IP 地址作为密码。

## 🔄 配置飞书应用

### 1. 设置 Webhook URL

在飞书开发者后台，将 Webhook URL 设置为：
```
https://feishu-webhook.loca.lt/api/webhook
```

### 2. 配置事件订阅

确保以下事件已启用：
- ✅ `message` - 消息事件
- ✅ `interactive` - 卡片交互事件  
- ✅ `user_added` - 用户加入事件

### 3. 验证配置

发送测试消息验证配置是否正确。

## 📝 使用说明

### 发送卡片消息

```bash
curl -X POST https://feishu-webhook.loca.lt/api/message \
  -H "Content-Type: application/json" \
  -d '{
    "type": "card",
    "content": {
      "title": "测试卡片",
      "elements": [
        {
          "tag": "div",
          "text": {
            "tag": "plain_text",
            "content": "这是一个测试卡片"
          }
        },
        {
          "tag": "action",
          "actions": [
            {
              "tag": "button",
              "text": {
                "tag": "plain_text",
                "content": "测试按钮"
              },
              "type": "default",
              "value": {
                "key": "test"
              }
            }
          ]
        }
      ]
    }
  }'
```

### 发送文本消息

```bash
curl -X POST https://feishu-webhook.loca.lt/api/message \
  -H "Content-Type: application/json" \
  -d '{
    "type": "text",
    "content": "这是一条测试消息"
  }'
```

## 🔍 监控和调试

### 查看服务状态

```bash
# 检查本地服务器
curl http://localhost:3000/api/health

# 检查 LocalTunnel 隧道
curl https://feishu-webhook.loca.lt/api/health

# 测试消息发送
curl -X POST https://feishu-webhook.loca.lt/api/message \
  -H "Content-Type: application/json" \
  -d '{"type": "text", "content": "测试消息"}'
```

### 查看日志

```bash
# 查看卡片交互日志
tail -f card_interactions.log

# 查看 Toast 通知日志
tail -f toast_notifications.log
```

### 访问控制台

- **本地测试页面**: http://localhost:3000/case
- **公网测试页面**: https://feishu-webhook.loca.lt/case

## 🛠️ 管理命令

### 启动服务
```bash
# 启动 LocalTunnel
./start-localtunnel-simple.sh

# 或者手动启动
npm start
npx localtunnel --port 3000 --subdomain feishu-webhook
```

### 停止服务
```bash
# 停止 LocalTunnel
./stop-localtunnel.sh

# 或者手动停止
pkill -f localtunnel
pkill -f "node dist/index.js"
```

## ⚠️ 注意事项

### 1. 密码验证
- 每次访问 `https://feishu-webhook.loca.lt` 都需要输入密码
- 密码是您的公网 IP 地址：`117.147.104.40`
- 密码可能会变化，请查看启动脚本的输出

### 2. 地址稳定性
- LocalTunnel 地址相对稳定
- 如果地址变化，需要重新配置飞书应用

### 3. 安全性
- 公网地址可以被任何人访问
- 不要在公网暴露敏感信息
- 定期检查访问日志

## 🎯 下一步

1. ✅ 配置飞书应用 Webhook URL
2. ✅ 测试卡片消息发送功能
3. ✅ 测试卡片按钮点击功能
4. 🔄 监控 LocalTunnel 状态和服务器日志

## 🎉 恭喜！

您的飞书 Webhook 服务已成功通过 LocalTunnel 暴露到公网！

**🌐 公网地址**: `https://feishu-webhook.loca.lt`
**🔑 访问密码**: `117.147.104.40`

请将此地址配置到您的飞书应用中，开始使用吧！ 