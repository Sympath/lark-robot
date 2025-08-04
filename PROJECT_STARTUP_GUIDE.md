# 🚀 飞书 Webhook 项目启动指南

## 📋 快速启动（推荐方式）

### 1. 一键启动
```bash
./start-localtunnel-simple.sh
```

这个脚本会自动：
- ✅ 检查本地服务器状态
- ✅ 停止现有的隧道进程
- ✅ 启动 LocalTunnel 隧道
- ✅ 显示所有重要信息

### 2. 启动后的信息
```
🌐 隧道地址: https://feishu-webhook.loca.lt
🔑 访问密码: 117.147.104.40
🔗 本地地址: http://localhost:3000
```

## 🔧 手动启动方式

### 方式一：分步启动
```bash
# 1. 构建项目
npm run build

# 2. 启动本地服务器
npm start

# 3. 启动 LocalTunnel（新终端）
npx localtunnel --port 3000 --subdomain feishu-webhook
```

### 方式二：使用其他隧道工具
```bash
# 使用 ngrok
./start-service.sh

# 使用 Cloudflare Tunnel
./start-cloudflare.sh

# 使用 Serveo
./start-serveo.sh

# 使用 PageKite
./start-pagekite.sh
```

## 🌐 可用的端点

启动后，您可以使用以下端点：

| 功能 | 端点 | 说明 |
|------|------|------|
| 健康检查 | `https://feishu-webhook.loca.lt/api/health` | 检查服务状态 |
| 测试页面 | `https://feishu-webhook.loca.lt/case` | 交互式测试界面 |
| 发送消息 | `https://feishu-webhook.loca.lt/api/message` | 发送文本/卡片消息 |
| Webhook | `https://feishu-webhook.loca.lt/api/callback` | 飞书事件回调 |
| 日志查看 | `https://feishu-webhook.loca.lt/api/logs` | 查看系统日志 |

## 🔧 飞书配置

### 1. 配置 Webhook URL
在飞书开发者后台配置：
```
https://feishu-webhook.loca.lt/api/callback
```

### 2. 验证 Token
确保 Token 与代码中的一致：
```
YMldy28rYB74elrtcGPVehdT32o0rM0Y
```

## 🧪 测试功能

### 1. 健康检查
```bash
curl https://feishu-webhook.loca.lt/api/health
```

### 2. 发送测试消息
```bash
curl -X POST https://feishu-webhook.loca.lt/api/message \
  -H "Content-Type: application/json" \
  -d '{"type": "text", "content": "测试消息"}'
```

### 3. 发送卡片消息
```bash
curl -X POST https://feishu-webhook.loca.lt/api/message \
  -H "Content-Type: application/json" \
  -d '{"type": "card", "content": {"title": "测试卡片", "elements": [{"tag": "div", "text": {"tag": "plain_text", "content": "这是一个测试卡片"}}, {"tag": "action", "actions": [{"tag": "button", "text": {"tag": "plain_text", "content": "点击测试"}, "type": "default", "value": {"key": "test"}}]}]}}'
```

### 4. 测试卡片按钮点击
```bash
node test_card_click.js
```

## 🛑 停止服务

### 停止所有服务
```bash
./stop-localtunnel.sh
```

### 仅停止隧道
```bash
pkill -f 'localtunnel'
```

### 仅停止本地服务器
```bash
pkill -f "node dist/index.js"
```

## 🔍 故障排除

### 1. LocalTunnel 密码问题
如果遇到 LocalTunnel 警告页面：
- 密码是您的公网 IP：`117.147.104.40`
- 或者使用：`curl https://loca.lt/mytunnelpassword`

### 2. 端口被占用
```bash
# 查看端口占用
lsof -i :3000

# 杀死占用进程
kill -9 <PID>
```

### 3. 构建失败
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 4. 隧道连接失败
```bash
# 检查网络连接
curl -s ifconfig.me

# 尝试其他隧道工具
./start-cloudflare.sh
```

## 📊 监控和日志

### 查看实时日志
```bash
# 查看服务器日志
tail -f tunnel.log

# 查看卡片交互日志
tail -f card_interactions.log
```

### 健康检查
```bash
# 检查服务状态
curl -s https://feishu-webhook.loca.lt/api/health | jq
```

## 🎯 常用命令速查

| 命令 | 功能 |
|------|------|
| `./start-localtunnel-simple.sh` | 一键启动（推荐） |
| `./stop-localtunnel.sh` | 停止所有服务 |
| `npm run build` | 构建项目 |
| `npm start` | 启动本地服务器 |
| `curl https://feishu-webhook.loca.lt/api/health` | 健康检查 |
| `node test_card_click.js` | 测试卡片按钮点击 |

## 🎉 启动成功标志

当您看到以下信息时，说明启动成功：

```
🚀 LocalTunnel 启动完成！
🌐 隧道地址: https://feishu-webhook.loca.lt
✅ 飞书 SDK 加载成功
```

现在您可以在飞书中正常使用所有功能了！ 