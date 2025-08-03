const http = require('http');

// 测试 case 页面功能
async function testCasePage() {
  console.log('🧪 测试 case 页面功能...');
  
  // 测试文本消息推送
  console.log('\n1. 测试文本消息推送...');
  try {
    const textResponse = await fetch('/api/case/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receive_id: 'oc_e55d91081dddae90bd877294a437ed2e',
        receive_id_type: 'chat_id'
      })
    });
    
    const textResult = await textResponse.json();
    if (textResult.success) {
      console.log('✅ 文本消息推送成功');
    } else {
      console.log('❌ 文本消息推送失败:', textResult.error);
    }
  } catch (error) {
    console.log('❌ 文本消息推送请求失败:', error.message);
  }

  // 测试卡片消息推送
  console.log('\n2. 测试卡片消息推送...');
  try {
    const cardResponse = await fetch('/api/case/card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receive_id: 'oc_e55d91081dddae90bd877294a437ed2e',
        receive_id_type: 'chat_id'
      })
    });
    
    const cardResult = await cardResponse.json();
    if (cardResult.success) {
      console.log('✅ 卡片消息推送成功');
    } else {
      console.log('❌ 卡片消息推送失败:', cardResult.error);
    }
  } catch (error) {
    console.log('❌ 卡片消息推送请求失败:', error.message);
  }

  // 测试交互卡片推送
  console.log('\n3. 测试交互卡片推送...');
  try {
    const interactiveResponse = await fetch('/api/case/interactive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receive_id: 'oc_e55d91081dddae90bd877294a437ed2e',
        receive_id_type: 'chat_id'
      })
    });
    
    const interactiveResult = await interactiveResponse.json();
    if (interactiveResult.success) {
      console.log('✅ 交互卡片推送成功');
    } else {
      console.log('❌ 交互卡片推送失败:', interactiveResult.error);
    }
  } catch (error) {
    console.log('❌ 交互卡片推送请求失败:', error.message);
  }

  // 检查服务状态
  console.log('\n4. 检查服务状态...');
  try {
    const healthResponse = await fetch('/api/health');
    const healthResult = await healthResponse.json();
    if (healthResult.status === 'healthy') {
      console.log('✅ 服务状态正常');
    } else {
      console.log('❌ 服务状态异常');
    }
  } catch (error) {
    console.log('❌ 状态检查失败:', error.message);
  }
}

// 模拟 fetch 函数
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url, 'http://localhost:3000');
    
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({
            json: () => Promise.resolve(result)
          });
        } catch (error) {
          resolve({
            json: () => Promise.resolve({ success: false, error: data })
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// 运行测试
testCasePage(); 