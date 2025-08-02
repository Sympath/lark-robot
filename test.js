const http = require('http');

// 测试健康检查
function testHealth() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 健康检查通过:', result.status);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 测试日志API
function testLogs() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/logs',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 日志API测试通过:', result.total, '条日志');
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// 测试Webhook回调
function testWebhook() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      type: 'url_verification',
      challenge: 'test-challenge-123'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/callback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Webhook测试通过:', result.challenge);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// 主测试函数
async function runTests() {
  console.log('🧪 开始测试飞书 Webhook 服务器...\n');
  
  try {
    await testHealth();
    await testLogs();
    await testWebhook();
    
    console.log('\n🎉 所有测试通过！');
    console.log('📱 Webhook URL: http://47.120.11.77:3000/api/callback');
    console.log('🏥 Health Check: http://47.120.11.77:3000/api/health');
    console.log('📝 Logs: http://47.120.11.77:3000/api/logs');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
runTests(); 