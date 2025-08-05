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
        'User-Agent': 'Encryption-Fix-Test/1.0',
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

async function testEncryptionFix() {
  console.log('🚀 开始加密修复测试...');
  console.log('==================================================');

  try {
    // 测试1: 标准 URL 验证（无加密）
    console.log('🧪 测试1: 标准 URL 验证（无加密）...');
    const testData1 = {
      type: 'url_verification',
      challenge: 'test_fix_123',
      token: 'glqekPS9pO55cF0bHfSEZbogArkR8inu'
    };
    
    const response1 = await makeRequest(TUNNEL_URL, testData1);
    console.log(`📊 响应状态码: ${response1.status}`);
    console.log(`📄 响应内容: ${response1.data}`);
    console.log('');

    // 测试2: 加密 URL 验证
    console.log('🧪 测试2: 加密 URL 验证...');
    const testData2 = {
      type: 'url_verification',
      challenge: 'test_fix_encrypted_456',
      token: 'glqekPS9pO55cF0bHfSEZbogArkR8inu'
    };
    
    const encryptedData = encryptData(testData2);
    const response2 = await makeRequest(TUNNEL_URL, {
      encrypted_data: encryptedData
    });
    
    console.log(`📊 响应状态码: ${response2.status}`);
    console.log(`📄 响应内容: ${response2.data}`);
    console.log('');

    // 测试3: 事件回调加密
    console.log('🧪 测试3: 事件回调加密...');
    const testData3 = {
      schema: '2.0',
      header: {
        event_id: 'test-event-id-fix',
        token: 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
        create_time: Date.now().toString(),
        event_type: 'url_verification',
        tenant_key: '1360dea83b0c175e',
        app_id: 'cli_a8079e4490b81013'
      },
      event: {
        type: 'url_verification',
        challenge: 'test_fix_event_789',
        token: 'glqekPS9pO55cF0bHfSEZbogArkR8inu'
      }
    };
    
    const encryptedData3 = encryptData(testData3);
    const response3 = await makeRequest(TUNNEL_URL, {
      encrypted_data: encryptedData3
    });
    
    console.log(`📊 响应状态码: ${response3.status}`);
    console.log(`📄 响应内容: ${response3.data}`);
    console.log('');

    // 总结
    console.log('📋 测试总结:');
    if (response1.status === 200 && response2.status === 200 && response3.status === 200) {
      console.log('✅ 所有测试通过！加密功能正常工作');
      console.log('💡 现在可以在飞书后台启用加密功能');
    } else {
      console.log('❌ 部分测试失败，需要进一步调试');
      console.log('💡 建议在飞书后台暂时关闭加密功能');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testEncryptionFix(); 