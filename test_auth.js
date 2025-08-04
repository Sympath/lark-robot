#!/usr/bin/env node

// 鉴权测试脚本
const https = require('https');
const crypto = require('crypto');

// 测试配置
const TEST_CONFIG = {
  appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
  verificationToken: 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
  baseUrl: 'https://feishu-webhook.loca.lt'
};

// 生成签名
function generateSignature(timestamp, nonce, body) {
  const signString = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto
    .createHmac('sha256', TEST_CONFIG.appSecret)
    .update(signString, 'utf8')
    .digest('base64');
}

// 测试 URL 验证
async function testUrlVerification() {
  console.log('🧪 测试 URL 验证...');
  
  const payload = {
    type: 'url_verification',
    challenge: 'test_challenge_' + Date.now(),
    token: TEST_CONFIG.verificationToken
  };

  const data = JSON.stringify(payload);
  
  const options = {
    hostname: 'feishu-webhook.loca.lt',
    port: 443,
    path: '/api/callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log(`📊 URL 验证响应: ${res.statusCode}`);
        console.log(`📄 响应内容: ${responseData}`);
        resolve({ statusCode: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.error('❌ URL 验证请求错误:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// 测试事件回调（带签名）
async function testEventCallbackWithSignature() {
  console.log('🧪 测试事件回调（带签名）...');
  
  const payload = {
    schema: '2.0',
    header: {
      event_id: 'test-event-id-' + Date.now(),
      token: TEST_CONFIG.verificationToken,
      create_time: Date.now().toString(),
      event_type: 'card.action.trigger',
      tenant_key: 'test_tenant',
      app_id: 'test_app'
    },
    event: {
      operator: {
        tenant_key: 'test_tenant',
        user_id: 'test_user',
        open_id: 'test_open_id'
      },
      token: 'test-token',
      action: {
        value: { key: 'test' },
        tag: 'button'
      },
      host: 'im_message',
      context: {
        open_message_id: 'test_message_id',
        open_chat_id: 'test_chat_id'
      }
    }
  };

  const data = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString('hex');
  const signature = generateSignature(timestamp, nonce, data);

  const options = {
    hostname: 'feishu-webhook.loca.lt',
    port: 443,
    path: '/api/callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-lark-request-timestamp': timestamp,
      'x-lark-request-nonce': nonce,
      'x-lark-signature': signature
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log(`📊 事件回调响应: ${res.statusCode}`);
        console.log(`📄 响应内容: ${responseData}`);
        resolve({ statusCode: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.error('❌ 事件回调请求错误:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// 测试事件回调（无签名）
async function testEventCallbackWithoutSignature() {
  console.log('🧪 测试事件回调（无签名）...');
  
  const payload = {
    schema: '2.0',
    header: {
      event_id: 'test-event-id-' + Date.now(),
      token: TEST_CONFIG.verificationToken,
      create_time: Date.now().toString(),
      event_type: 'card.action.trigger',
      tenant_key: 'test_tenant',
      app_id: 'test_app'
    },
    event: {
      operator: {
        tenant_key: 'test_tenant',
        user_id: 'test_user',
        open_id: 'test_open_id'
      },
      token: 'test-token',
      action: {
        value: { key: 'test' },
        tag: 'button'
      },
      host: 'im_message',
      context: {
        open_message_id: 'test_message_id',
        open_chat_id: 'test_chat_id'
      }
    }
  };

  const data = JSON.stringify(payload);
  
  const options = {
    hostname: 'feishu-webhook.loca.lt',
    port: 443,
    path: '/api/callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log(`📊 事件回调响应（无签名）: ${res.statusCode}`);
        console.log(`📄 响应内容: ${responseData}`);
        resolve({ statusCode: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.error('❌ 事件回调请求错误:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// 测试无效 Token
async function testInvalidToken() {
  console.log('🧪 测试无效 Token...');
  
  const payload = {
    type: 'url_verification',
    challenge: 'test_challenge_' + Date.now(),
    token: 'invalid_token'
  };

  const data = JSON.stringify(payload);
  
  const options = {
    hostname: 'feishu-webhook.loca.lt',
    port: 443,
    path: '/api/callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      res.on('end', () => {
        console.log(`📊 无效 Token 响应: ${res.statusCode}`);
        console.log(`📄 响应内容: ${responseData}`);
        resolve({ statusCode: res.statusCode, data: responseData });
      });
    });

    req.on('error', (error) => {
      console.error('❌ 无效 Token 请求错误:', error);
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// 运行所有测试
async function runAllTests() {
  console.log('🚀 开始鉴权测试...\n');

  try {
    // 测试 1: URL 验证
    console.log('='.repeat(50));
    await testUrlVerification();
    
    // 测试 2: 事件回调（带签名）
    console.log('\n' + '='.repeat(50));
    await testEventCallbackWithSignature();
    
    // 测试 3: 事件回调（无签名）
    console.log('\n' + '='.repeat(50));
    await testEventCallbackWithoutSignature();
    
    // 测试 4: 无效 Token
    console.log('\n' + '='.repeat(50));
    await testInvalidToken();
    
    console.log('\n✅ 所有测试完成！');
  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
  }
}

// 运行测试
runAllTests(); 