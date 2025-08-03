# LocalTunnel 警告页面解决方案

## 🚨 问题描述

当通过 LocalTunnel 访问应用时，浏览器会显示警告页面：
- **警告内容**: "This website is served for free via a localtunnel. You should only visit this website if you trust whoever sent this link to you."
- **问题原因**: LocalTunnel 需要密码验证才能访问应用
- **影响**: 前端 JavaScript 请求被拦截，导致 "Unexpected token '<'" 错误

## ✅ 解决方案

### 方案1: 浏览器访问（推荐）

1. **打开浏览器** 访问: `https://feishu-webhook.loca.lt`
2. **输入密码**: `117.147.104.40`
3. **点击 Continue** 按钮
4. **现在可以正常使用** 所有功能

### 方案2: 使用 curl 命令（无需浏览器）

```bash
# 测试健康检查
curl https://feishu-webhook.loca.lt/api/health

# 发送文本消息
curl -X POST https://feishu-webhook.loca.lt/api/message \
  -H "Content-Type: application/json" \
  -d '{"type": "text", "content": "测试消息"}'

# 发送卡片消息
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
        }
      ]
    }
  }'
```

### 方案3: 前端自动检测（已实现）

我已经修改了前端代码，现在它会：

1. **自动检测** LocalTunnel 环境
2. **显示警告提示** 当检测到警告页面时
3. **提供解决方案** 指导用户如何处理

## 🔧 技术实现

### 前端检测逻辑

```javascript
// 检测是否在 LocalTunnel 环境中
function isLocalTunnel() {
  return window.location.hostname.includes('loca.lt') || 
         window.location.hostname.includes('localtunnel');
}

// 处理 LocalTunnel 警告页面
async function handleLocalTunnelWarning() {
  if (!isLocalTunnel()) return false;
  
  try {
    // 尝试直接访问 API 端点
    const response = await fetch('/api/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'healthy') {
        return false; // 不需要处理警告页面
      }
    }
  } catch (error) {
    console.log('检测到 LocalTunnel 警告页面');
  }
  
  // 显示警告页面处理提示
  const warningDiv = document.createElement('div');
  warningDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #ff6b6b; color: white; padding: 10px; text-align: center; z-index: 9999;';
  warningDiv.innerHTML = `
    <strong>LocalTunnel 警告页面检测</strong><br>
    请在浏览器中访问: <a href="${window.location.origin}" target="_blank" style="color: white; text-decoration: underline;">${window.location.origin}</a><br>
    输入密码: <strong>117.147.104.40</strong> 然后点击 Continue<br>
    或者使用 curl 命令直接测试 API
  `;
  document.body.appendChild(warningDiv);
  
  return true;
}
```

## 📊 当前状态

- ✅ **LocalTunnel 隧道**: 正常运行
- ✅ **健康检查**: 正常响应
- ✅ **验证端点**: 正常工作
- ✅ **前端检测**: 已实现
- ✅ **飞书 Webhook**: 验证成功

## 🎯 使用步骤

### 1. 浏览器访问（推荐）

1. 打开浏览器访问: `https://feishu-webhook.loca.lt`
2. 输入密码: `117.147.104.40`
3. 点击 "Continue" 按钮
4. 现在可以正常使用所有功能

### 2. 命令行测试

```bash
# 测试健康检查
curl https://feishu-webhook.loca.lt/api/health

# 测试验证端点
curl -X POST https://feishu-webhook.loca.lt/api/callback \
  -H "Content-Type: application/json" \
  -d '{"type": "url_verification", "challenge": "test_challenge"}'
```

### 3. 飞书配置

在飞书开发者后台配置 Webhook URL:
```
https://feishu-webhook.loca.lt/api/callback
```

## 🔍 故障排除

### 问题1: 仍然看到警告页面

**解决方案**:
1. 确保输入正确的密码: `117.147.104.40`
2. 点击 "Continue" 按钮
3. 如果问题持续，尝试刷新页面

### 问题2: 前端显示错误

**解决方案**:
1. 检查浏览器控制台是否有错误信息
2. 确保已经通过了 LocalTunnel 的验证
3. 尝试使用 curl 命令测试 API

### 问题3: 飞书 Webhook 验证失败

**解决方案**:
1. 确保使用正确的 URL: `https://feishu-webhook.loca.lt/api/callback`
2. 检查服务器日志
3. 使用 curl 测试验证端点

## 📝 注意事项

1. **密码**: LocalTunnel 的密码就是您的公网 IP 地址
2. **URL**: 必须使用 `/api/callback` 而不是 `/api/webhook`
3. **浏览器**: 建议使用现代浏览器（Chrome、Firefox、Safari）
4. **网络**: 确保网络连接正常

## 🎉 总结

现在您有三种方式使用应用：

1. **浏览器访问** - 输入密码后正常使用
2. **命令行测试** - 使用 curl 命令直接测试
3. **飞书集成** - 自动处理，无需手动验证

所有功能都已正常工作，包括：
- ✅ 健康检查
- ✅ 发送文本消息
- ✅ 发送卡片消息
- ✅ 飞书 Webhook 验证
- ✅ 日志查看

---

**🎉 问题已解决！现在可以正常使用所有功能了！** 