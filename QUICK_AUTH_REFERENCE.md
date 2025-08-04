# 飞书鉴权快速参考

## 🚀 快速开始

### 1. 环境变量配置
```bash
export FEISHU_APP_ID=cli_xxx
export FEISHU_APP_SECRET=xxx
export FEISHU_VERIFICATION_TOKEN=xxx
export ENABLE_SIGNATURE_VALIDATION=true
export ENABLE_TOKEN_VALIDATION=true
```

### 2. 启动服务
```bash
# 构建项目
npm run build

# 启动服务
./start-localtunnel-simple.sh
```

### 3. 测试鉴权
```bash
# 运行鉴权测试
node test_auth.js
```

## 🔧 核心代码

### 鉴权服务
```typescript
// 验证 Token
const tokenResult = authService.validateToken(payload);

// 验证签名
const signatureResult = authService.validateSignature(req);

// 综合验证
const authResult = authService.validateRequest(req);
```

### 中间件使用
```typescript
app.post('/api/callback', 
  authMiddleware.logRequest.bind(authMiddleware),
  authMiddleware.validateFeishuWebhook.bind(authMiddleware),
  (req, res) => webhookController.handleCallback(req, res)
);
```

## 📋 配置选项

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `FEISHU_APP_ID` | `cli_a8079e4490b81013` | 飞书应用 ID |
| `FEISHU_APP_SECRET` | `GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI` | 飞书应用密钥 |
| `FEISHU_VERIFICATION_TOKEN` | `glqekPS9pO55cF0bHfSEZbogArkR8inu` | 验证 Token |
| `ENABLE_SIGNATURE_VALIDATION` | `false` | 启用签名验证 |
| `ENABLE_TOKEN_VALIDATION` | `true` | 启用 Token 验证 |
| `ENABLE_REQUEST_LOGGING` | `true` | 启用请求日志 |

## 🧪 测试场景

### URL 验证测试
```javascript
const payload = {
  type: 'url_verification',
  challenge: 'test_challenge',
  token: 'your_verification_token'
};
```

### 事件回调测试
```javascript
const payload = {
  schema: '2.0',
  header: {
    event_id: 'test-event-id',
    token: 'your_verification_token',
    event_type: 'card.action.trigger'
  },
  event: {
    action: {
      value: { key: 'test' },
      tag: 'button'
    }
  }
};
```

## 📊 响应状态码

| 状态码 | 说明 | 处理方式 |
|--------|------|----------|
| `200` | 成功 | 正常处理 |
| `401` | 鉴权失败 | 检查 Token 和签名 |
| `400` | 请求格式错误 | 检查请求体格式 |
| `500` | 服务器错误 | 查看服务器日志 |

## 🔍 常见问题

### Q: Token 验证失败
**A**: 检查 `FEISHU_VERIFICATION_TOKEN` 是否与飞书应用配置一致

### Q: 签名验证失败
**A**: 检查 `FEISHU_APP_SECRET` 和签名算法实现

### Q: 请求被拒绝
**A**: 确保启用了相应的验证选项

### Q: 日志不显示
**A**: 检查 `ENABLE_REQUEST_LOGGING` 是否设置为 `true`

## 📚 相关文档

- [完整鉴权指南](./FEISHU_AUTH_GUIDE.md)
- [技术集成文档](./LARK_NODE_INTEGRATION_GUIDE.md)
- [鉴权系统完善总结](./AUTH_SYSTEM_ENHANCEMENT.md)

## 🎯 最佳实践

1. **生产环境**: 启用所有安全验证
2. **开发环境**: 可选择性禁用部分验证
3. **日志记录**: 始终启用请求日志
4. **错误处理**: 实现优雅的错误处理
5. **性能优化**: 使用缓存机制

---

**💡 提示**: 使用 `node test_auth.js` 快速验证鉴权功能是否正常！ 