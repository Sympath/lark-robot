const http = require('http');

// 模拟卡片按钮点击事件
async function testCardClick() {
  console.log('🧪 测试卡片按钮点击事件...');
  
  // 模拟飞书交互事件
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

  const postData = JSON.stringify(cardInteractionEvent);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 卡片按钮点击测试结果:', result);
          resolve(result);
        } catch (error) {
          console.error('❌ 解析响应失败:', data);
          resolve({ success: false, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 请求失败:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.write(postData);
    req.end();
  });
}

// 测试不同的按钮
async function testAllButtons() {
  const buttons = ['confirm', 'cancel', 'primary', 'secondary'];
  
  for (const button of buttons) {
    console.log(`\n🔘 测试按钮: ${button}`);
    
    const event = {
      "schema": "2.0",
      "header": {
        "event_id": `test_${button}_button`,
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
            "key": button
          },
          "tag": "button"
        },
        "message_id": `om_test_${button}_${Date.now()}`
      }
    };

    const postData = JSON.stringify(event);

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/callback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    await new Promise((resolve) => {
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            console.log(`✅ ${button} 按钮测试结果:`, result);
          } catch (error) {
            console.error(`❌ ${button} 按钮测试失败:`, data);
          }
          resolve();
        });
      });

      req.on('error', (error) => {
        console.error(`❌ ${button} 按钮请求失败:`, error.message);
        resolve();
      });

      req.write(postData);
      req.end();
    });

    // 等待一秒再测试下一个按钮
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 检查日志文件
function checkLogFiles() {
  const fs = require('fs');
  
  console.log('\n📋 检查日志文件:');
  
  const logFiles = [
    'card_interactions.log',
    'toast_notifications.log', 
    'toast_errors.log'
  ];
  
  logFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      console.log(`\n📄 ${file}:`);
      console.log(content);
    } else {
      console.log(`\n❌ ${file} 不存在`);
    }
  });
}

// 运行测试
async function runTests() {
  console.log('🚀 开始卡片按钮点击测试...');
  
  // 测试单个按钮点击
  await testCardClick();
  
  // 等待一秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 测试所有按钮
  await testAllButtons();
  
  // 等待一秒
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 检查日志文件
  checkLogFiles();
}

runTests(); 