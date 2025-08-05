#!/usr/bin/env node

const crypto = require('crypto');
const https = require('https');

// 配置
const ENCRYPT_KEY = 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb';
const TUNNEL_URL = 'https://feishu-webhook.loca.lt';

// 模拟飞书加密数据
function encryptData(data) {
  const jsonString = JSON.stringify(data);
  
  // 生成随机 IV
  const iv = crypto.randomBytes(16);
  
  // 添加 PKCS7 padding
  const blockSize = 16;
  const paddingLength = blockSize - (jsonString.length % blockSize);
  const padding = String.fromCharCode(paddingLength).repeat(paddingLength);
  const paddedData = jsonString + padding;
  
  // 使用 AES-256-CBC 加密
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPT_KEY, iv);
  cipher.setAutoPadding(false);
  
  let encrypted = cipher.update(paddedData, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  // 组合 IV + 加密数据
  const result = Buffer.concat([iv, encrypted]);
  return result.toString('base64');
}

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
        'User-Agent': 'Test-Script/1.0',
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
          data: responseData
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

// 测试数据
const testData = {
  type: 'url_verification',
  challenge: 'test_challenge_encrypted',
  token: 'glqekPS9pO55cF0bHfSEZbogArkR8inu'
};

const eventData = {
  schema: '2.0',
  header: {
    event_id: 'test-event-id-encrypted',
    token: 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
    create_time: Date.now().toString(),
    event_type: 'card.action.trigger',
    tenant_key: '1360dea83b0c175e',
    app_id: 'cli_a8079e4490b81013'
  },
  event: {
    operator: {
      tenant_key: '1360dea83b0c175e',
      user_id: 'c5bf39fa',
      open_id: 'ou_84d2a19714d506a9595efcb4f98a9f63',
      union_id: 'on_35da71652f5f6998ef620ab2f6c94766'
    },
    token: 'test-token-encrypted',
    action: {
      value: { key: 'test' },
      tag: 'button'
    },
    host: 'im_message',
    context: {
      open_message_id: 'om_x100b47c2ce09bcc80f16d2813bac638',
      open_chat_id: 'oc_e55d91081dddae90bd877294a437ed2e'
    }
  }
};

async function testEncryption() {
  console.log('🚀 开始加密功能测试...');
  console.log('==================================================');

  try {
    // 测试 URL 验证加密
    console.log('🧪 测试加密 URL 验证...');
    const encryptedUrlVerification = encryptData(testData);
    
    const urlVerificationResponse = await makeRequest(TUNNEL_URL, {
      encrypted_data: encryptedUrlVerification
    });

    console.log(`📊 加密 URL 验证响应: ${urlVerificationResponse.status}`);
    console.log(`📄 响应内容: ${urlVerificationResponse.data}`);
    console.log('');

    // 测试事件回调加密
    console.log('🧪 测试加密事件回调...');
    const encryptedEventData = encryptData(eventData);
    
    const eventResponse = await makeRequest(TUNNEL_URL, {
      encrypted_data: encryptedEventData
    });

    console.log(`📊 加密事件回调响应: ${eventResponse.status}`);
    console.log(`📄 响应内容: ${eventResponse.data}`);
    console.log('');

    // 测试普通请求（非加密）
    console.log('🧪 测试普通非加密请求...');
    const normalResponse = await makeRequest(TUNNEL_URL, testData);

    console.log(`📊 普通请求响应: ${normalResponse.status}`);
    console.log(`📄 响应内容: ${normalResponse.data}`);
    console.log('');

    console.log('✅ 所有加密测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testEncryption(); 