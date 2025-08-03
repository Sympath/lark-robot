const lark = require('@larksuiteoapi/node-sdk');

console.log('SDK 版本:', require('@larksuiteoapi/node-sdk/package.json').version);

// 构建 API Client
const client = new lark.Client({
  appId: 'cli_a8079e4490b81013',
  appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
});

console.log('Client 对象:', typeof client);
console.log('Client.im:', typeof client.im);
console.log('Client.im.message:', typeof client.im.message);

// 检查所有可用的方法
console.log('Client.im.message 的所有属性:', Object.keys(client.im.message));

// 尝试调用方法
try {
  console.log('尝试调用 create 方法...');
  const result = client.im.message.create({
    params: {
      receive_id_type: 'user_id',
    },
    data: {
      receive_id: 'c5bf39fa',
      content: JSON.stringify({ text: 'test' }),
      msg_type: 'text',
    },
  });
  console.log('✅ 调用成功:', result);
} catch (error) {
  console.error('❌ 调用失败:', error.message);
} 