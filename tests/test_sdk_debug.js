// 详细调试 SDK 问题
const lark = require('@larksuiteoapi/node-sdk');

console.log('=== 详细 SDK 调试开始 ===');

try {
  // 构建 API Client
  const client = new lark.Client({
    appId: 'cli_a8079e4490b81013',
    appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
  });

  console.log('✅ Client 创建成功');
  console.log('Client 类型:', typeof client);
  console.log('Client.im 类型:', typeof client.im);
  console.log('Client.im.message 类型:', typeof client.im.message);

  // 检查所有方法
  const methods = Object.keys(client.im.message);
  console.log('所有方法:', methods);
  console.log('create 方法存在:', methods.includes('create'));
  console.log('create 方法类型:', typeof client.im.message.create);

  // 尝试调用
  if (typeof client.im.message.create === 'function') {
    console.log('✅ create 方法是函数，尝试调用...');
    
    const result = client.im.message.create({
      params: {
        receive_id_type: 'user_id',
      },
      data: {
        receive_id: 'c5bf39fa',
        content: JSON.stringify({ text: 'debug test' }),
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
    
  } else {
    console.log('❌ create 方法不是函数');
    console.log('client.im.message 的详细信息:', client.im.message);
  }

} catch (error) {
  console.error('❌ 创建 Client 失败:', error.message);
  console.error('错误堆栈:', error.stack);
}

console.log('=== 详细 SDK 调试结束 ==='); 