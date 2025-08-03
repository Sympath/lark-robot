# 🚀 Ngrok 替代方案指南

## 📋 问题说明

您遇到的 ngrok 警告页面是免费版的限制。以下是几个优秀的替代方案：

## 🌟 推荐方案

### 1. **LocalTunnel** (最简单，推荐)
- ✅ **完全免费**
- ✅ **无警告页面**
- ✅ **无需配置**
- ✅ **即开即用**

#### 使用方法：
```bash
# 启动 LocalTunnel
./start-localtunnel.sh

# 停止 LocalTunnel
./stop-localtunnel.sh
```

#### 特点：
- 地址格式：`https://feishu-webhook.loca.lt`
- 无任何警告页面
- 直接可用

### 2. **Cloudflare Tunnel** (最稳定)
- ✅ **免费且无限制**
- ✅ **更稳定**
- ✅ **支持自定义域名**
- ✅ **安全性更高**

#### 使用方法：
```bash
# 首次使用需要登录
cloudflared tunnel login

# 启动 Cloudflare Tunnel
./start-cloudflare.sh

# 停止 Cloudflare Tunnel
./stop-cloudflare.sh
```

#### 特点：
- 需要 Cloudflare 账户
- 支持自定义域名
- 企业级稳定性

### 3. **Serveo** (SSH 方式)
- ✅ **免费使用**
- ✅ **SSH 隧道方式**

#### 使用方法：
```bash
# 使用 SSH 隧道
ssh -R 80:localhost:3000 serveo.net
```

## 🔄 迁移步骤

### 从 ngrok 迁移到 LocalTunnel

1. **停止 ngrok 服务**
```bash
./stop-service.sh
```

2. **启动 LocalTunnel**
```bash
./start-localtunnel.sh
```

3. **更新飞书应用配置**
   - 将 Webhook URL 更新为新的 LocalTunnel 地址
   - 例如：`https://feishu-webhook.loca.lt/api/webhook`

4. **测试功能**
```bash
# 测试健康检查
curl https://feishu-webhook.loca.lt/api/health

# 测试消息发送
curl -X POST https://feishu-webhook.loca.lt/api/message \
  -H "Content-Type: application/json" \
  -d '{"type": "text", "content": "测试消息"}'
```

## 📊 方案对比

| 特性 | Ngrok | LocalTunnel | Cloudflare Tunnel |
|------|-------|-------------|-------------------|
| 免费额度 | 有限制 | 无限制 | 无限制 |
| 警告页面 | ✅ | ❌ | ❌ |
| 配置复杂度 | 简单 | 最简单 | 中等 |
| 稳定性 | 一般 | 良好 | 优秀 |
| 自定义域名 | 付费 | 不支持 | 支持 |
| 安全性 | 一般 | 良好 | 优秀 |

## 🎯 推荐选择

### 快速解决方案：LocalTunnel
```bash
./start-localtunnel.sh
```

### 长期解决方案：Cloudflare Tunnel
```bash
./start-cloudflare.sh
```

## 🔧 故障排除

### LocalTunnel 问题
```bash
# 检查 LocalTunnel 状态
ps aux | grep localtunnel

# 重启 LocalTunnel
pkill -f localtunnel
./start-localtunnel.sh
```

### Cloudflare Tunnel 问题
```bash
# 检查隧道状态
cloudflared tunnel info feishu-webhook

# 重新登录
cloudflared tunnel login
```

## 📝 注意事项

1. **LocalTunnel 地址会变化**
   - 每次重启可能获得不同的子域名
   - 需要及时更新飞书应用配置

2. **Cloudflare Tunnel 需要域名**
   - 需要有自己的域名
   - 需要配置 DNS 记录

3. **测试建议**
   - 迁移后立即测试所有功能
   - 监控日志确保正常工作

## 🎉 总结

推荐使用 **LocalTunnel** 作为 ngrok 的替代方案，它：
- 完全免费
- 无警告页面
- 配置简单
- 即开即用

立即开始使用：
```bash
./start-localtunnel.sh
``` 