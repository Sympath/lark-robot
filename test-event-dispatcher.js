#!/usr/bin/env node

/**
 * 测试 EventDispatcher URL 验证功能
 * 使用加密密钥: qsJboodT6Or4STWCp9DqHfbwWrG5TqPb
 */

const crypto = require('crypto');
const https = require('https');
const http = require('http');

// 配置
const CONFIG = {
  encryptKey: 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb',
  verificationToken: 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
  appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
  baseUrl: 'https://feishu-webhook.loca.lt',
  localUrl: 'http://localhost:3000'
};

/**
 * 加密数据
 */
function encryptData(data) {
  try {
    const jsonString = JSON.stringify(data);
    const key = crypto.createHash('sha256').update(CONFIG.encryptKey).digest();
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(true);
    
    let encrypted = cipher.update(jsonString, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    const result = Buffer.concat([iv, encrypted]);
    return result.toString('base64');
  } catch (error) {
    console.error('❌ 加密失败:', error.message);
    return null;
  }
}

/**
 * 生成签名
 */
function generateSignature(timestamp, nonce, body) {
  const signString = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto
    .createHmac('sha256', CONFIG.appSecret)
    .update(signString, 'utf8')
    .digest('base64');
}

/**
 * 发送 HTTP 请求
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            data: data ? JSON.parse(data) : null
          };
          resolve(result);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

/**
 * 测试 URL 验证（未加密）
 */
async function testUrlVerificationUnencrypted(url) {
  console.log(`\n🔍 测试 URL 验证（未加密）: ${url}`);
  
  const payload = {
    type: 'url_verification',
    challenge: 'test_challenge_' + Date.now(),
    token: CONFIG.verificationToken
  };

  try {
    const response = await makeRequest(`${url}/api/callback`, {
      method: 'POST',
      headers: {
        'X-Lark-Request-Timestamp': Math.floor(Date.now() / 1000).toString(),
        'X-Lark-Request-Nonce': crypto.randomBytes(16).toString('hex')
      },
      body: payload
    });
    
    if (response.status === 200 && response.data && response.data.challenge === payload.challenge) {
      console.log('✅ URL 验证成功');
      console.log('📋 响应:', response.data);
      return true;
    } else {
      console.log('❌ URL 验证失败');
      console.log('📋 响应:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
    return false;
  }
}

/**
 * 测试 URL 验证（加密）
 */
async function testUrlVerificationEncrypted(url) {
  console.log(`\n🔍 测试 URL 验证（加密）: ${url}`);
  
  const payload = {
    type: 'url_verification',
    challenge: 'test_challenge_encrypted_' + Date.now(),
    token: CONFIG.verificationToken
  };

  const encryptedData = encryptData(payload);
  if (!encryptedData) {
    console.log('❌ 数据加密失败');
    return false;
  }

  const requestBody = {
    encrypted_data: encryptedData
  };

  try {
    const response = await makeRequest(`${url}/api/callback`, {
      method: 'POST',
      headers: {
        'X-Lark-Request-Timestamp': Math.floor(Date.now() / 1000).toString(),
        'X-Lark-Request-Nonce': crypto.randomBytes(16).toString('hex')
      },
      body: requestBody
    });
    
    if (response.status === 200 && response.data && response.data.challenge === payload.challenge) {
      console.log('✅ 加密 URL 验证成功');
      console.log('📋 响应:', response.data);
      return true;
    } else {
      console.log('❌ 加密 URL 验证失败');
      console.log('📋 响应:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ 请求失败:', error.message);
    return false;
  }
}

/**
 * 测试健康检查
 */
async function testHealthCheck(url) {
  console.log(`\n🏥 测试健康检查: ${url}`);
  
  try {
    const response = await makeRequest(`${url}/api/health`);
    
    if (response.status === 200 && response.data && response.data.status === 'healthy') {
      console.log('✅ 健康检查通过');
      console.log('📋 响应:', response.data);
      return true;
    } else {
      console.log('❌ 健康检查失败');
      console.log('📋 响应:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ 健康检查请求失败:', error.message);
    return false;
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log('🚀 开始测试 EventDispatcher URL 验证功能');
  console.log('==========================================');
  console.log('🔑 加密密钥:', CONFIG.encryptKey);
  console.log('🎫 验证令牌:', CONFIG.verificationToken);
  console.log('');

  const results = {
    localHealth: false,
    localUrlVerification: false,
    localEncryptedVerification: false,
    remoteHealth: false,
    remoteUrlVerification: false,
    remoteEncryptedVerification: false
  };

  // 测试本地服务
  console.log('🏠 测试本地服务 (localhost:3000)');
  console.log('================================');
  
  results.localHealth = await testHealthCheck(CONFIG.localUrl);
  results.localUrlVerification = await testUrlVerificationUnencrypted(CONFIG.localUrl);
  results.localEncryptedVerification = await testUrlVerificationEncrypted(CONFIG.localUrl);

  // 测试远程服务
  console.log('\n🌐 测试远程服务 (feishu-webhook.loca.lt)');
  console.log('=====================================');
  
  results.remoteHealth = await testHealthCheck(CONFIG.baseUrl);
  results.remoteUrlVerification = await testUrlVerificationUnencrypted(CONFIG.baseUrl);
  results.remoteEncryptedVerification = await testUrlVerificationEncrypted(CONFIG.baseUrl);

  // 输出测试结果
  console.log('\n📊 测试结果汇总');
  console.log('================');
  console.log('本地服务:');
  console.log(`  健康检查: ${results.localHealth ? '✅' : '❌'}`);
  console.log(`  URL验证: ${results.localUrlVerification ? '✅' : '❌'}`);
  console.log(`  加密验证: ${results.localEncryptedVerification ? '✅' : '❌'}`);
  console.log('');
  console.log('远程服务:');
  console.log(`  健康检查: ${results.remoteHealth ? '✅' : '❌'}`);
  console.log(`  URL验证: ${results.remoteUrlVerification ? '✅' : '❌'}`);
  console.log(`  加密验证: ${results.remoteEncryptedVerification ? '✅' : '❌'}`);
  console.log('');

  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('🎉 所有测试通过！EventDispatcher 配置正确');
    console.log('🔗 飞书 Webhook URL: https://feishu-webhook.loca.lt/api/callback');
  } else {
    console.log('⚠️ 部分测试失败，请检查配置');
  }

  return allPassed;
}

// 运行测试
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, CONFIG };