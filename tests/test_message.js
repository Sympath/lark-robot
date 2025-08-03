const http = require('http');
const https = require('https'); // 新增

// 测试发送默认消息
function testDefaultMessage() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/message',
      method: 'PUT'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 默认消息发送结果:', result);
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

// 测试发送自定义消息
function testCustomMessage() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      receive_id: 'c5bf39fa',
      receive_id_type: 'user_id',
      content: JSON.stringify({ text: 'Hello from test script!' }),
      msg_type: 'text'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/message',
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
          console.log('✅ 自定义消息发送结果:', result);
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

// 测试公网地址（修复：用https模块）
function testPublicMessage() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'plains-physiology-mines-liver.trycloudflare.com',
      port: 443,
      path: '/api/message',
      method: 'PUT'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 公网消息发送结果:', result);
          resolve(result);
        } catch (error) {
          // 打印原始响应内容，方便排查
          console.error('❌ 公网响应内容:', data);
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// 主测试函数
async function runTests() {
  console.log('🧪 开始测试消息发送功能...\n');
  
  try {
    console.log('1. 测试本地默认消息发送...');
    await testDefaultMessage();
    
    console.log('\n2. 测试本地自定义消息发送...');
    await testCustomMessage();
    
    // console.log('\n3. 测试公网消息发送...');
    // await testPublicMessage();
    
    console.log('\n🎉 所有测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
runTests(); 