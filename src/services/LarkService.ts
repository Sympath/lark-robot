import config from '../config';
import { MessageRequest } from '../types';

export class LarkService {
  private client: any = null;
  private initialized: boolean = false;

  constructor() {
    this.initializeClient();
  }

  private async initializeClient(): Promise<void> {
    try {
      // 使用 require 导入 SDK
      const lark = require('@larksuiteoapi/node-sdk');
      
      // 构建 API Client
      this.client = new lark.Client({
        appId: config.appId,
        appSecret: config.appSecret,
      });
      
      // 等待一小段时间确保 SDK 完全初始化
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ 飞书 SDK 加载成功');
      this.initialized = true;
    } catch (error) {
      console.log('⚠️ 飞书 SDK 未安装，使用模拟实现');
      this.client = null;
      this.initialized = false;
    }
  }

  public isSDKLoaded(): boolean {
    return this.client !== null && this.client.im !== undefined && this.initialized;
  }

  public async sendMessage(messageRequest: MessageRequest): Promise<any> {
    // 确保 SDK 已初始化
    if (!this.initialized) {
      await this.initializeClient();
    }
    
    if (!this.client) {
      throw new Error('Lark SDK not loaded');
    }

    try {
      // 确保 client 已经初始化
      if (!this.client.im || !this.client.im.message) {
        throw new Error('Lark SDK not properly initialized');
      }

      console.log('🔍 调试信息:');
      console.log('- client 类型:', typeof this.client);
      console.log('- client.im 类型:', typeof this.client.im);
      console.log('- client.im.message 类型:', typeof this.client.im.message);
      console.log('- client.im.message.create 类型:', typeof this.client.im.message.create);
      console.log('- client.im.message 的所有方法:', Object.keys(this.client.im.message));

      // 通过 Client 调用「发送消息」接口
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

  public async sendCardMessage(messageRequest: MessageRequest): Promise<any> {
    // 确保 SDK 已初始化
    if (!this.initialized) {
      await this.initializeClient();
    }
    
    if (!this.client) {
      throw new Error('Lark SDK not loaded');
    }

    const response = await this.client.im.message.createByCard({
      data: {
        receive_id: messageRequest.receive_id,
        template_id: messageRequest.template_id!,
        template_variable: messageRequest.template_variable || {},
      },
      params: { 
        receive_id_type: messageRequest.receive_id_type || 'user_id' 
      },
    });

    return response;
  }
} 