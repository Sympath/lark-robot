const crypto = require('crypto');

// 飞书加密密钥
const encryptKey = 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb';

// 模拟一个真实的事件数据
const eventData = {
  type: 'url_verification',
  challenge: 'test_challenge_123'
};

// 将事件数据转换为JSON字符串
const jsonData = JSON.stringify(eventData);

// 生成随机字符串作为加密的IV
const iv = crypto.randomBytes(16);

// 创建加密器
const cipher = crypto.createCipher('aes-256-cbc', encryptKey);
cipher.setAutoPadding(true);

// 加密数据
let encrypted = cipher.update(jsonData, 'utf8', 'base64');
encrypted += cipher.final('base64');

console.log('原始事件数据:', jsonData);
console.log('加密后的数据:', encrypted);

// 创建请求体
const requestBody = {
  encrypt: encrypted
};

// 生成时间戳和随机数
const timestamp = Math.floor(Date.now() / 1000).toString();
const nonce = 'test-nonce-' + Math.random().toString(36).substr(2, 9);

// 创建签名（简化版本）
const signature = crypto.createHash('sha256')
  .update(timestamp + nonce + encrypted)
  .digest('hex');

console.log('\n请求头:');
console.log('x-lark-request-timestamp:', timestamp);
console.log('x-lark-request-nonce:', nonce);
console.log('x-lark-signature:', signature);

console.log('\n请求体:');
console.log(JSON.stringify(requestBody, null, 2));

// 测试请求
const https = require('https');

const postData = JSON.stringify(requestBody);

const options = {
  hostname: 'feishu-webhook-new.loca.lt',
  port: 443,
  path: '/webhook',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'x-lark-request-timestamp': timestamp,
    'x-lark-request-nonce': nonce,
    'x-lark-signature': signature,
  }
};

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n响应体:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(`请求错误: ${e.message}`);
});

req.write(postData);
req.end();