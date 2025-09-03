# LocalTunnel 密码解决方案

## 问题描述

当访问 `https://feishu-webhook.loca.lt` 时，会看到 LocalTunnel 的密码验证页面，提示：
> "To access the website, please enter the tunnel password below."

## 解决方案

### 方法1: 使用公网 IP 作为密码

1. **获取您的公网 IP**:
   ```bash
   curl -s ifconfig.me
   ```

2. **在密码输入框中输入您的公网 IP 地址**

3. **点击 "Continue" 按钮**

### 方法2: 使用绕过脚本

运行我们提供的绕过脚本：
```bash
./bypass-localtunnel-warning.sh
```

脚本会自动：
- 获取您的公网 IP
- 显示 LocalTunnel 密码
- 提供多种解决方案

### 方法3: 直接测试 API（推荐）

由于飞书等第三方服务会自动处理验证，您可以直接测试 API：

```bash
# 测试 URL 验证
curl -X POST https://feishu-webhook.loca.lt/api/callback \
  -H "Content-Type: application/json" \
  -d '{"type": "url_verification", "challenge": "test_challenge", "token": "glqekPS9pO55cF0bHfSEZbogArkR8inu"}'
```

## 当前状态

### ✅ 已解决的问题
1. **EventDispatcher 集成**: 成功使用 `lark.adaptExpress` 适配器
2. **URL 验证**: 完全正常工作
3. **Challenge 响应**: 自动返回正确的 challenge 值

### 🔧 技术实现
- **加密密钥**: `qsJboodT6Or4STWCp9DqHfbwWrG5TqPb` ✅
- **Express 适配器**: 自动处理 URL 验证 ✅
- **服务端点**: `/api/callback` 正常工作 ✅

## 飞书开发者后台配置

现在您可以在飞书开发者后台配置：

- **请求地址**: `https://feishu-webhook.loca.lt/api/callback`
- **加密密钥**: `qsJboodT6Or4STWCp9DqHfbwWrG5TqPb`
- **验证令牌**: `glqekPS9pO55cF0bHfSEZbogArkR8inu`

## 重要说明

1. **LocalTunnel 密码**: 就是您的公网 IP 地址
2. **第三方服务**: 飞书等第三方服务会自动处理验证，无需手动输入密码
3. **测试建议**: 直接使用 API 测试，无需通过浏览器访问

## 验证步骤

1. 确保服务正在运行：
   ```bash
   curl http://localhost:3000/api/health
   ```

2. 测试 URL 验证：
   ```bash
   curl -X POST http://localhost:3000/api/callback \
     -H "Content-Type: application/json" \
     -d '{"type": "url_verification", "challenge": "test", "token": "glqekPS9pO55cF0bHfSEZbogArkR8inu"}'
   ```

3. 在飞书开发者后台配置 webhook URL

## 故障排除

如果仍然遇到问题：

1. **检查 LocalTunnel 状态**:
   ```bash
   ps aux | grep localtunnel
   ```

2. **重启 LocalTunnel**:
   ```bash
   pkill -f localtunnel
   npx localtunnel --port 3000 --subdomain feishu-webhook
   ```

3. **检查服务状态**:
   ```bash
   curl http://localhost:3000/api/health
   ```

现在您的飞书 Webhook 服务已经完全配置好了，可以正常处理 URL 验证和事件回调！