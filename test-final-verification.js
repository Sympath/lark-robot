#!/usr/bin/env node

/**
 * 最终验证测试脚本
 * 测试 EventDispatcher Express 适配器的 URL 验证功能
 */

const crypto = require('crypto');
const http = require('http');

// 配置
const CONFIG = {
  encryptKey: 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb',
  verificationToken: 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
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
 * 发送 HTTP 请求
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 80,
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
    challenge: 'test_challenge_final_' + Date.now(),
    token: CONFIG.verificationToken
  };

  try {
    const response = await makeRequest(`${url}/api/callback`, {
      method: 'POST',
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
    challenge: 'test_challenge_encrypted_final_' + Date.now(),
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
  console.log('🚀 最终验证测试 - EventDispatcher Express 适配器');
  console.log('================================================');
  console.log('🔑 加密密钥:', CONFIG.encryptKey);
  console.log('🎫 验证令牌:', CONFIG.verificationToken);
  console.log('');

  const results = {
    health: false,
    urlVerification: false,
    encryptedVerification: false
  };

  // 测试本地服务
  console.log('🏠 测试本地服务 (localhost:3000)');
  console.log('================================');
  
  results.health = await testHealthCheck(CONFIG.localUrl);
  results.urlVerification = await testUrlVerificationUnencrypted(CONFIG.localUrl);
  results.encryptedVerification = await testUrlVerificationEncrypted(CONFIG.localUrl);

  // 输出测试结果
  console.log('\n📊 测试结果汇总');
  console.log('================');
  console.log('本地服务:');
  console.log(`  健康检查: ${results.health ? '✅' : '❌'}`);
  console.log(`  URL验证: ${results.urlVerification ? '✅' : '❌'}`);
  console.log(`  加密验证: ${results.encryptedVerification ? '✅' : '❌'}`);
  console.log('');

  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('🎉 所有测试通过！EventDispatcher Express 适配器配置正确');
    console.log('🔗 飞书 Webhook URL: https://feishu-webhook.loca.lt/api/callback');
    console.log('💡 注意: 需要确保 LocalTunnel 正常运行才能访问远程 URL');
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