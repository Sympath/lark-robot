#!/usr/bin/env node

const https = require('https');

// 配置
const TUNNEL_URL = 'https://feishu-webhook.loca.lt';
const VERIFICATION_TOKEN = 'glqekPS9pO55cF0bHfSEZbogArkR8inu';

// HTTP 请求函数
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'feishu-webhook.loca.lt',
      port: 443,
      path: '/api/callback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Feishu-Verification-Test/1.0',
        'Content-Length': Buffer.byteLength(postData)
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

async function testFeishuVerification() {
  console.log('🚀 开始飞书 URL 验证测试...');
  console.log('==================================================');

  try {
    // 测试标准 URL 验证
    console.log('🧪 测试标准 URL 验证...');
    const testData = {
      type: 'url_verification',
      challenge: 'feishu_challenge_test_123',
      token: VERIFICATION_TOKEN
    };
    
    const response = await makeRequest(TUNNEL_URL, testData);

    console.log(`📊 响应状态码: ${response.status}`);
    console.log(`📄 响应内容: ${response.data}`);
    console.log(`📋 响应头: ${JSON.stringify(response.headers, null, 2)}`);
    console.log('');

    if (response.status === 200) {
      console.log('✅ URL 验证成功！');
      console.log('💡 请将此 URL 配置到飞书后台:');
      console.log(`   ${TUNNEL_URL}/api/callback`);
      console.log('');
      console.log('🔧 飞书后台配置步骤:');
      console.log('1. 选择 "将回调发送至开发者服务器"');
      console.log('2. 请求地址填写: ' + TUNNEL_URL + '/api/callback');
      console.log('3. 验证 Token: ' + VERIFICATION_TOKEN);
      console.log('4. 点击 "前往加密策略" 配置加密');
      console.log('5. 保存配置');
    } else {
      console.log('❌ URL 验证失败！');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testFeishuVerification(); 