// 模拟服务环境测试 SDK
const lark = require('@larksuiteoapi/node-sdk');

console.log('=== SDK 测试开始 ===');

// 构建 API Client
const client = new lark.Client({
  appId: 'cli_a8079e4490b81013',
  appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
});

console.log('Client 类型:', typeof client);
console.log('Client.im 类型:', typeof client.im);
console.log('Client.im.message 类型:', typeof client.im.message);

// 检查 create 方法
console.log('Client.im.message.create 类型:', typeof client.im.message.create);
console.log('Client.im.message 的所有方法:', Object.keys(client.im.message));

// 尝试调用
try {
  console.log('尝试调用 create 方法...');
  const result = client.im.message.create({
    params: {
      receive_id_type: 'user_id',
    },
    data: {
      receive_id: 'c5bf39fa',
      content: JSON.stringify({ text: 'test from service' }),
      msg_type: 'text',
    },
  });
  console.log('✅ 调用成功，结果类型:', typeof result);
  
  // 等待 Promise 完成
  result.then(res => {
    console.log('✅ Promise 完成:', res);
  }).catch(err => {
    console.error('❌ Promise 失败:', err.message);
  });
  
} catch (error) {
  console.error('❌ 同步调用失败:', error.message);
}

console.log('=== SDK 测试结束 ==='); 