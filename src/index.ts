import { App } from './app';
import config from './config';

// 在启动时测试 SDK
async function testSDKOnStartup() {
  try {
    console.log('🧪 启动时测试 SDK...');
    const lark = require('@larksuiteoapi/node-sdk');
    const client = new lark.Client({
      appId: config.appId,
      appSecret: config.appSecret,
    });
    
    console.log('SDK Client 类型:', typeof client);
    console.log('SDK Client.im 类型:', typeof client.im);
    console.log('SDK Client.im.message 类型:', typeof client.im.message);
    console.log('SDK Client.im.message.create 类型:', typeof client.im.message.create);
    
    if (typeof client.im.message.create === 'function') {
      console.log('✅ SDK 初始化成功，create 方法可用');
      
      // 尝试实际调用
      const result = await client.im.message.create({
        params: {
          receive_id_type: 'user_id',
        },
        data: {
          receive_id: 'c5bf39fa',
          content: JSON.stringify({ text: 'startup test' }),
          msg_type: 'text',
        },
      });
      
      console.log('✅ 启动时 SDK 调用成功:', result);
    } else {
      console.log('❌ SDK 初始化失败，create 方法不可用');
      console.log('client.im.message 的所有属性:', Object.keys(client.im.message));
    }
  } catch (error) {
    console.error('❌ SDK 测试失败:', error);
  }
}

const app = new App();
const server = app.getApp().listen(config.port, () => {
  console.log(`[${new Date().toISOString()}] INFO: Server started on port ${config.port}`);
  console.log('🚀 Feishu Webhook Server is running on port', config.port);
  console.log('📱 Webhook URL:', `http://${config.host}:${config.port}/api/callback`);
  console.log('🏥 Health Check:', `http://${config.host}:${config.port}/api/health`);
  console.log('📝 Logs:', `http://${config.host}:${config.port}/api/logs`);
  console.log('🔧 SDK Status:', 'Loaded');
  
  // 启动时测试 SDK
  testSDKOnStartup();
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] INFO: Server shutting down gracefully`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log(`[${new Date().toISOString()}] INFO: Server shutting down gracefully`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 