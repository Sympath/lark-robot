# 飞书 Webhook 验证问题解决方案

## 🚨 问题描述

在配置飞书 Webhook URL 时遇到错误：
- **错误信息**: "返回数据不是合法的JSON格式"
- **URL**: `https://feishu-webhook.loca.lt/api/callback`
- **问题原因**: 飞书在验证 Webhook URL 时期望收到正确的 JSON 响应

## ✅ 解决方案

### 1. 添加专门的验证端点

```typescript
// src/controllers/WebhookController.ts
public async handleUrlVerification(req: Request, res: Response): Promise<void> {
  try {
    const payload = req.body;
    console.log('🔍 URL 验证请求:', JSON.stringify(payload, null, 2));
    
    // 处理 URL 验证
    if (payload.type === 'url_verification') {
      console.log('✅ URL 验证成功，challenge:', payload.challenge);
      this.logService.addLog('info', 'URL verification successful', { challenge: payload.challenge });
      
      // 返回正确的 JSON 格式
      res.setHeader('Content-Type', 'application/json');
      res.json({ challenge: payload.challenge });
      return;
    }

    // 如果不是验证请求，返回错误
    res.status(400).json({ error: 'Invalid verification request' });
  } catch (error) {
    console.error('URL 验证失败:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
}
```

### 2. 配置路由

```typescript
// src/index.ts
// API路由
app.post('/api/callback', (req, res) => webhookController.handleUrlVerification(req, res));
```

### 3. 正确的 Webhook URL

在飞书开发者后台配置以下 URL：
```
https://feishu-webhook.loca.lt/api/callback
```

## 🧪 测试验证

### 测试验证端点

```bash
curl -X POST https://feishu-webhook.loca.lt/api/callback \
  -H "Content-Type: application/json" \
  -d '{"type": "url_verification", "challenge": "test_challenge"}'
```

**期望响应**:
```json
{"challenge":"test_challenge"}
```

### 测试健康检查

```bash
curl https://feishu-webhook.loca.lt/api/health
```

## 📋 配置步骤

### 1. 在飞书开发者后台

1. 进入 **事件订阅** 页面
2. 设置 **请求地址** 为: `https://feishu-webhook.loca.lt/api/callback`
3. 点击 **保存** 按钮
4. 系统会自动验证 URL

### 2. 验证成功标志

- ✅ 请求地址显示为绿色
- ✅ 没有错误提示
- ✅ 可以正常接收事件

## 🔧 故障排除

### 问题1: 仍然显示 JSON 格式错误

**解决方案**:
1. 确保服务器正在运行
2. 检查 LocalTunnel 是否正常
3. 重新构建项目: `npm run build`
4. 重启服务器: `npm start`

### 问题2: 无法访问验证端点

**解决方案**:
1. 检查防火墙设置
2. 确认 LocalTunnel 隧道正常
3. 测试本地端点: `curl http://localhost:3000/api/callback`

### 问题3: 验证通过但无法接收事件

**解决方案**:
1. 检查事件订阅配置
2. 确保应用有正确的权限
3. 查看服务器日志

## 📊 当前状态

- ✅ **LocalTunnel 隧道**: 正常运行
- ✅ **验证端点**: 正常工作
- ✅ **健康检查**: 正常响应
- ✅ **消息发送**: 功能正常

## 🎯 下一步

1. ✅ 配置飞书 Webhook URL: `https://feishu-webhook.loca.lt/api/callback`
2. ✅ 验证 URL 验证通过
3. 🔄 测试事件接收
4. 🔄 配置事件订阅

## 📝 注意事项

1. **URL 格式**: 必须使用 `/api/callback` 而不是 `/api/webhook`
2. **JSON 响应**: 验证端点必须返回正确的 JSON 格式
3. **Content-Type**: 响应头必须设置为 `application/json`
4. **Challenge**: 必须返回飞书发送的 challenge 值

---

**🎉 问题已解决！现在可以正常配置飞书 Webhook 了！** 