#!/usr/bin/env node

// 测试卡片按钮点击事件
const https = require('https');

// 模拟飞书发送的卡片按钮点击事件
const testEvent = {
  "schema": "2.0",
  "header": {
    "event_id": "test-event-id",
    "token": "YMldy28rYB74elrtcGPVehdT32o0rM0Y",
    "create_time": "1754228748449",
    "event_type": "card.action.trigger",
    "tenant_key": "1360dea83b0c175e",
    "app_id": "cli_a8079e4490b81013"
  },
  "event": {
    "operator": {
      "tenant_key": "1360dea83b0c175e",
      "user_id": "c5bf39fa",
      "open_id": "ou_84d2a19714d506a9595efcb4f98a9f63",
      "union_id": "on_35da71652f5f6998ef620ab2f6c94766"
    },
    "token": "test-token",
    "action": {
      "value": {
        "key": "test"
      },
      "tag": "button"
    },
    "host": "im_message",
    "context": {
      "open_message_id": "om_x100b47c2ce09bcc80f16d2813bac638",
      "open_chat_id": "oc_e55d91081dddae90bd877294a437ed2e"
    }
  }
};

// 发送测试请求
function sendTestRequest() {
  const data = JSON.stringify(testEvent);
  
  const options = {
    hostname: 'feishu-webhook.loca.lt',
    port: 443,
    path: '/api/callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'User-Agent': 'Test-Script/1.0'
    }
  };

  console.log('🚀 发送测试卡片按钮点击事件...');
  console.log('📋 事件数据:', JSON.stringify(testEvent, null, 2));

  const req = https.request(options, (res) => {
    console.log(`📊 响应状态码: ${res.statusCode}`);
    console.log(`📋 响应头:`, res.headers);

    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('📄 响应内容:', responseData);
      
      if (res.statusCode === 200) {
        console.log('✅ 测试成功！卡片按钮点击事件处理正常');
      } else {
        console.log('❌ 测试失败！卡片按钮点击事件处理异常');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ 请求错误:', error);
  });

  req.write(data);
  req.end();
}

// 运行测试
sendTestRequest(); 