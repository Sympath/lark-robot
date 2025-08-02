const http = require('http');

// 测试 webhook 事件
async function testWebhook() {
  console.log('🧪 开始测试 webhook 事件...');
  
  // 模拟卡片按钮点击事件
  const cardInteractionEvent = {
    "schema": "2.0",
    "header": {
      "event_id": "test_card_interaction",
      "token": "YMldy28rYB74elrtcGPVehdT32o0rM0Y",
      "create_time": "1754105082677",
      "event_type": "im.message.receive_v1",
      "tenant_key": "1360dea83b0c175e",
      "app_id": "cli_a8079e4490b81013"
    },
    "event": {
      "type": "interactive",
      "chat_id": "oc_e55d91081dddae90bd877294a437ed2e",
      "user_id": "c5bf39fa",
      "open_id": "ou_84d2a19714d506a9595efcb4f98a9f63",
      "action": {
        "value": {
          "key": "confirm"
        },
        "tag": "button",
        "option": "A"
      },
      "message_id": "om_x100b47ec016a48440f1966c4094fa2c"
    }
  };

  // 测试确认按钮点击
  try {
    console.log('1. 测试确认按钮点击事件...');
    
    const postData = JSON.stringify(cardInteractionEvent);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/callback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 确认按钮点击事件处理结果:', result);
        } catch (error) {
          console.log('❌ 解析响应失败:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 确认按钮点击事件发送失败:', error.message);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('❌ 确认按钮点击事件发送异常:', error.message);
  }

  // 测试取消按钮点击
  try {
    console.log('\n2. 测试取消按钮点击事件...');
    
    const cancelEvent = {
      ...cardInteractionEvent,
      event: {
        ...cardInteractionEvent.event,
        action: {
          value: {
            key: "cancel"
          },
          tag: "button",
          option: "B"
        }
      }
    };

    const postData = JSON.stringify(cancelEvent);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/callback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 取消按钮点击事件处理结果:', result);
        } catch (error) {
          console.log('❌ 解析响应失败:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 取消按钮点击事件发送失败:', error.message);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('❌ 取消按钮点击事件发送异常:', error.message);
  }

  // 测试主要操作按钮点击
  try {
    console.log('\n3. 测试主要操作按钮点击事件...');
    
    const primaryEvent = {
      ...cardInteractionEvent,
      event: {
        ...cardInteractionEvent.event,
        action: {
          value: {
            key: "primary"
          },
          tag: "button",
          option: "C"
        }
      }
    };

    const postData = JSON.stringify(primaryEvent);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/callback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 主要操作按钮点击事件处理结果:', result);
        } catch (error) {
          console.log('❌ 解析响应失败:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 主要操作按钮点击事件发送失败:', error.message);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('❌ 主要操作按钮点击事件发送异常:', error.message);
  }

  console.log('\n🎉 Webhook 事件测试完成！');
}

// 运行测试
testWebhook(); 