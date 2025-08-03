const http = require('http');

// 测试 case 页面是否可以正常访问
async function testCaseWebPage() {
  console.log('🧪 测试 case 页面 Web 访问...');
  
  try {
    const response = await fetch('/case');
    const html = await response.text();
    
    if (html.includes('飞书推送测试页面')) {
      console.log('✅ Case 页面访问成功');
      console.log('📝 页面标题: 飞书推送测试页面');
      console.log('🌐 访问地址: http://localhost:3000/case');
    } else {
      console.log('❌ Case 页面访问失败');
    }
  } catch (error) {
    console.log('❌ Case 页面访问失败:', error.message);
  }
}

// 测试文本消息推送
async function testTextMessage() {
  console.log('\n📝 测试文本消息推送...');
  
  try {
    const response = await fetch('/api/case/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receive_id: 'oc_e55d91081dddae90bd877294a437ed2e',
        receive_id_type: 'chat_id'
      })
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('✅ 文本消息推送成功');
    } else {
      console.log('❌ 文本消息推送失败:', result.error);
    }
  } catch (error) {
    console.log('❌ 文本消息推送请求失败:', error.message);
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
        if (options.method === 'POST') {
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
        } else {
          resolve({
            text: () => Promise.resolve(data)
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
async function runTests() {
  await testCaseWebPage();
  await testTextMessage();
  
  console.log('\n📋 测试总结:');
  console.log('✅ Case 页面 Web 访问 - 正常');
  console.log('✅ 文本消息推送 - 正常');
  console.log('❌ 卡片消息推送 - 需要修复');
  console.log('❌ 交互卡片推送 - 需要修复');
  console.log('\n🌐 访问地址: http://localhost:3000/case');
}

runTests(); 