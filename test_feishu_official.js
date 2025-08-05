#!/usr/bin/env node

const https = require('https');

// 配置
const TUNNEL_URL = 'https://feishu-webhook.loca.lt';
const VERIFICATION_TOKEN = 'glqekPS9pO55cF0bHfSEZbogArkR8inu';

// HTTP 请求函数
function makeRequest(url, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'feishu-webhook.loca.lt',
      port: 443,
      path: '/api/callback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Feishu-Official-Test/1.0',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: responseData,
          headers: res.headers
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testFeishuOfficial() {
  console.log('🚀 开始飞书官方格式验证测试...');
  console.log('==================================================');

  try {
    // 测试1: 标准 URL 验证（无加密）
    console.log('🧪 测试1: 标准 URL 验证（无加密）...');
    const testData1 = {
      type: 'url_verification',
      challenge: 'feishu_official_test_123',
      token: VERIFICATION_TOKEN
    };
    
    const response1 = await makeRequest(TUNNEL_URL, testData1);

    console.log(`📊 响应状态码: ${response1.status}`);
    console.log(`📄 响应内容: ${response1.data}`);
    console.log('');

    // 测试2: 带飞书官方头部的验证
    console.log('🧪 测试2: 带飞书官方头部的验证...');
    const testData2 = {
      type: 'url_verification',
      challenge: 'feishu_official_test_456',
      token: VERIFICATION_TOKEN
    };
    
    const headers2 = {
      'X-Lark-Request-Timestamp': Math.floor(Date.now() / 1000).toString(),
      'X-Lark-Request-Nonce': 'test-nonce-' + Date.now(),
      'X-Lark-Signature': 'test-signature'
    };
    
    const response2 = await makeRequest(TUNNEL_URL, testData2, headers2);

    console.log(`📊 响应状态码: ${response2.status}`);
    console.log(`📄 响应内容: ${response2.data}`);
    console.log('');

    // 测试3: 事件回调格式
    console.log('🧪 测试3: 事件回调格式...');
    const testData3 = {
      schema: '2.0',
      header: {
        event_id: 'test-event-id-official',
        token: VERIFICATION_TOKEN,
        create_time: Date.now().toString(),
        event_type: 'url_verification',
        tenant_key: '1360dea83b0c175e',
        app_id: 'cli_a8079e4490b81013'
      },
      event: {
        type: 'url_verification',
        challenge: 'feishu_official_test_789',
        token: VERIFICATION_TOKEN
      }
    };
    
    const response3 = await makeRequest(TUNNEL_URL, testData3);

    console.log(`📊 响应状态码: ${response3.status}`);
    console.log(`📄 响应内容: ${response3.data}`);
    console.log('');

    // 总结
    console.log('📋 测试总结:');
    console.log('✅ 如果所有测试都返回 200 状态码，说明服务正常');
    console.log('❌ 如果有 401/400 错误，需要检查配置');
    console.log('');
    console.log('🔧 飞书后台配置建议:');
    console.log('1. 请求地址: ' + TUNNEL_URL + '/api/callback');
    console.log('2. 验证 Token: ' + VERIFICATION_TOKEN);
    console.log('3. 暂时关闭加密功能进行测试');
    console.log('4. 保存配置后重试');

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testFeishuOfficial(); 