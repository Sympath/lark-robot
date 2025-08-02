# 🌐 飞书 Webhook 服务器公网地址

## ✅ 部署成功！

### 🔗 公网地址
**https://plains-physiology-mines-liver.trycloudflare.com**

### 📡 API 端点

#### Webhook 回调
- **URL**: `https://plains-physiology-mines-liver.trycloudflare.com/api/callback`
- **方法**: `POST`
- **用途**: 接收飞书事件回调

#### 健康检查
- **URL**: `https://plains-physiology-mines-liver.trycloudflare.com/api/health`
- **方法**: `GET`
- **用途**: 检查服务健康状态

#### 日志查看
- **URL**: `https://plains-physiology-mines-liver.trycloudflare.com/api/logs`
- **方法**: `GET`
- **用途**: 查看服务日志

#### 消息发送
- **URL**: `https://plains-physiology-mines-liver.trycloudflare.com/api/message`
- **方法**: `PUT` (默认消息) / `POST` (自定义消息)
- **用途**: 发送消息到飞书

### 🧪 测试结果

#### ✅ 健康检查测试
```bash
curl https://plains-physiology-mines-liver.trycloudflare.com/api/health
```
**结果**: 返回健康状态 JSON

#### ✅ Webhook 测试
```bash
curl -X POST https://plains-physiology-mines-liver.trycloudflare.com/api/callback \
  -H "Content-Type: application/json" \
  -d '{"type":"url_verification","challenge":"test-123"}'
```
**结果**: 返回 `{"challenge":"test-123"}`

### 🔧 飞书配置

在飞书开发者后台配置：

1. **Webhook URL**: `https://plains-physiology-mines-liver.trycloudflare.com/api/callback`
2. **验证令牌**: `glqekPS9pO55cF0bHfSEZbogArkR8inu`
3. **事件订阅**: 根据需要订阅消息、用户等事件

### 📊 服务状态

- **状态**: ✅ 正常运行
- **SDK**: ✅ 飞书 SDK 已加载
- **隧道**: ✅ Cloudflare Tunnel 已建立
- **端口**: 3000 (本地)
- **协议**: HTTPS (公网)

### 🛠️ 管理命令

```bash
# 查看服务状态
curl https://plains-physiology-mines-liver.trycloudflare.com/api/health

# 查看日志
curl https://plains-physiology-mines-liver.trycloudflare.com/api/logs

# 发送测试消息
curl -X PUT https://plains-physiology-mines-liver.trycloudflare.com/api/message

# 停止隧道 (在终端中按 Ctrl+C)
```

### ⚠️ 注意事项

1. **临时隧道**: 这是 Cloudflare 的临时隧道，重启后会改变地址
2. **生产环境**: 建议使用固定的域名和 SSL 证书
3. **安全**: 公网地址可以被任何人访问，请注意安全配置
4. **监控**: 建议定期检查服务健康状态

### 🎯 下一步

1. 在飞书开发者后台配置 Webhook URL
2. 测试消息发送功能
3. 监控服务运行状态
4. 根据需要配置生产环境

---

**部署时间**: 2025-08-02 10:16:33 UTC  
**隧道地址**: https://plains-physiology-mines-liver.trycloudflare.com  
**状态**: ✅ 正常运行 