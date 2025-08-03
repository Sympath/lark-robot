// 模拟服务环境的 SDK 测试
const lark = require('@larksuiteoapi/node-sdk');

console.log('=== 服务环境 SDK 测试开始 ===');

class MockLarkService {
  constructor() {
    this.client = null;
    this.initialized = false;
    this.initializeClient();
  }

  async initializeClient() {
    try {
      console.log('🔄 初始化 SDK...');
      this.client = new lark.Client({
        appId: 'cli_a8079e4490b81013',
        appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
      });
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ SDK 初始化成功');
      this.initialized = true;
    } catch (error) {
      console.log('❌ SDK 初始化失败:', error.message);
      this.client = null;
      this.initialized = false;
    }
  }

  async sendMessage(messageRequest) {
    if (!this.initialized) {
      await this.initializeClient();
    }
    
    if (!this.client) {
      throw new Error('Lark SDK not loaded');
    }

    try {
      if (!this.client.im || !this.client.im.message) {
        throw new Error('Lark SDK not properly initialized');
      }

      console.log('🔍 服务环境调试信息:');
      console.log('- client 类型:', typeof this.client);
      console.log('- client.im 类型:', typeof this.client.im);
      console.log('- client.im.message 类型:', typeof this.client.im.message);
      console.log('- client.im.message.create 类型:', typeof this.client.im.message.create);

      const res = await this.client.im.message.create({
        params: {
          receive_id_type: messageRequest.receive_id_type || 'user_id',
        },
        data: {
          receive_id: messageRequest.receive_id,
          content: messageRequest.content || JSON.stringify({ text: 'hello world' }),
          msg_type: messageRequest.msg_type || 'text',
        },
      });

      return res;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }
}

// 测试
async function test() {
  const service = new MockLarkService();
  
  try {
    const result = await service.sendMessage({
      receive_id: 'c5bf39fa',
      receive_id_type: 'user_id',
      content: JSON.stringify({ text: 'test from service mock' }),
      msg_type: 'text'
    });
    
    console.log('✅ 服务测试成功:', result);
  } catch (error) {
    console.error('❌ 服务测试失败:', error.message);
  }
}

test(); 