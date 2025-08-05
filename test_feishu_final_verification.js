#!/usr/bin/env node

const https = require('https');

// 配置
const TUNNEL_URL = 'https://feishu-webhook.loca.lt';
const VERIFICATION_TOKEN = 'glqekPS9pO55cF0bHfSEZbogArkR8inu';
const ENCRYPT_KEY = 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb';

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
        'User-Agent': 'Feishu-Final-Verification/1.0',
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

async function testFeishuFinalVerification() {
  console.log('🚀 飞书最终验证测试');
  console.log('==================================================');
  console.log('📋 当前配置信息:');
  console.log(`   请求地址: ${TUNNEL_URL}/api/callback`);
  console.log(`   验证 Token: ${VERIFICATION_TOKEN}`);
  console.log(`   加密 Key: ${ENCRYPT_KEY}`);
  console.log('');

  try {
    // 测试标准 URL 验证
    console.log('🧪 测试标准 URL 验证...');
    const testData = {
      type: 'url_verification',
      challenge: 'feishu_final_test_123',
      token: VERIFICATION_TOKEN
    };

    const response = await makeRequest(TUNNEL_URL, testData);

    console.log(`📊 响应状态码: ${response.status}`);
    console.log(`📄 响应内容: ${response.data}`);
    console.log('');

    if (response.status === 200) {
      console.log('✅ URL 验证成功！');
      console.log('');
      console.log('🎉 所有测试通过！现在可以在飞书后台进行配置：');
      console.log('');
      console.log('🔧 飞书后台配置步骤:');
      console.log('1. 进入飞书开发者后台');
      console.log('2. 选择你的应用');
      console.log('3. 进入 "事件订阅" 页面');
      console.log('4. 选择 "将回调发送至开发者服务器"');
      console.log('5. 填写以下信息:');
      console.log(`   - 请求地址: ${TUNNEL_URL}/api/callback`);
      console.log(`   - 验证 Token: ${VERIFICATION_TOKEN}`);
      console.log('6. 点击 "前往加密策略"');
      console.log('7. 启用加密功能');
      console.log(`8. 填写加密 Key: ${ENCRYPT_KEY}`);
      console.log('9. 保存配置');
      console.log('');
      console.log('💡 配置完成后，飞书会自动发送验证请求');
      console.log('✅ 如果看到绿色成功提示，说明配置正确');
      console.log('');
      console.log('📝 注意事项:');
      console.log('- 确保 URL 没有多余空格');
      console.log('- 确保 Token 完全匹配');
      console.log('- 确保加密 Key 正确');
      console.log('- 如果遇到问题，可以暂时关闭加密功能进行测试');
    } else {
      console.log('❌ URL 验证失败！');
      console.log('请检查服务状态和配置');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testFeishuFinalVerification(); 