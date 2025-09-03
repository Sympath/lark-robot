import { EventDispatcher } from '@larksuiteoapi/node-sdk';
import Koa from 'koa';
import { LogService } from './LogService';
import authConfig from '../config/auth';

export class EventDispatcherService {
  private eventDispatcher!: EventDispatcher;
  private logService: LogService;

  constructor(logService: LogService) {
    this.logService = logService;
    this.initializeEventDispatcher();
  }

  private initializeEventDispatcher(): void {
    try {
      // 创建 EventDispatcher 实例
      this.eventDispatcher = new EventDispatcher({
        encryptKey: authConfig.encryptKey,
        verificationToken: authConfig.verificationToken
      });

      // 注册事件处理器
      this.eventDispatcher.register({
        'im.message.receive_v1': this.handleMessageEvent.bind(this),
      });

      this.logService.addLog('info', 'EventDispatcher initialized successfully', {
        encryptKey: authConfig.encryptKey ? 'configured' : 'not configured',
        verificationToken: authConfig.verificationToken ? 'configured' : 'not configured',
        appSecret: authConfig.appSecret ? 'configured' : 'not configured'
      });

      console.log('✅ EventDispatcher 初始化成功');
    } catch (error) {
      console.error('❌ EventDispatcher 初始化失败:', error);
      this.logService.addLog('error', 'EventDispatcher initialization failed', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * 处理 URL 验证请求
   */
  private async handleUrlVerification(data: any): Promise<any> {
    try {
      console.log('🔍 处理 URL 验证请求:', JSON.stringify(data, null, 2));
      
      this.logService.addLog('info', 'URL verification request received', {
        challenge: data.challenge,
        token: data.token,
        timestamp: new Date().toISOString()
      });

      // 验证 token
      if (data.token !== authConfig.verificationToken) {
        const error = 'Invalid verification token';
        console.error('❌ URL 验证失败:', error);
        this.logService.addLog('error', 'URL verification failed', { error });
        throw new Error(error);
      }

      console.log('✅ URL 验证成功，challenge:', data.challenge);
      this.logService.addLog('info', 'URL verification successful', { 
        challenge: data.challenge,
        timestamp: new Date().toISOString()
      });

      // 返回 challenge 值
      return {
        challenge: data.challenge
      };
    } catch (error) {
      console.error('❌ URL 验证处理失败:', error);
      this.logService.addLog('error', 'URL verification processing failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }



  /**
   * 处理消息事件
   */
  private async handleMessageEvent(data: any): Promise<any> {
    try {
      console.log('📝 处理消息事件:', JSON.stringify(data, null, 2));
      
      this.logService.addLog('info', 'Message event received', {
        messageId: data.message?.message_id,
        chatId: data.message?.chat_id,
        senderId: data.sender?.sender_id,
        timestamp: new Date().toISOString()
      });

      // 这里可以添加自动回复逻辑
      // await this.autoReplyToMessage(data);

      return { success: true };
    } catch (error) {
      console.error('❌ 消息事件处理失败:', error);
      this.logService.addLog('error', 'Message event processing failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }



  /**
   * 处理 webhook 请求
   */
  public async handleWebhookRequest(ctx: Koa.Context): Promise<void> {
    try {
      console.log('🔍 使用 EventDispatcher 处理 webhook 请求');
      
      const payload = ctx.request.body;
      
      // 处理 URL 验证请求
      if ((payload as any).type === 'url_verification') {
        const result = await this.handleUrlVerification(payload);
        ctx.status = 200;
        ctx.set('Content-Type', 'application/json');
        ctx.body = result;
        return;
      }
      
      // 构造 EventDispatcher 需要的数据格式
      const eventData = {
        body: payload,
        headers: ctx.headers
      };
      
      // 使用 EventDispatcher 处理其他事件
      const result = await this.eventDispatcher.invoke(eventData);
      
      console.log('✅ EventDispatcher 处理完成:', result);
      this.logService.addLog('info', 'EventDispatcher processing completed', { result });
      
      // 返回结果
      ctx.status = 200;
      ctx.set('Content-Type', 'application/json');
      ctx.body = result || { success: true };
      
    } catch (error) {
      console.error('❌ EventDispatcher 处理失败:', error);
      this.logService.addLog('error', 'EventDispatcher processing failed', error instanceof Error ? error.message : 'Unknown error');
      
      // 返回错误响应
      ctx.status = 500;
      ctx.body = { 
        error: 'EventDispatcher processing failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 获取 EventDispatcher 实例
   */
  public getEventDispatcher(): EventDispatcher {
    return this.eventDispatcher;
  }

  /**
   * 检查 EventDispatcher 是否已初始化
   */
  public isInitialized(): boolean {
    return this.eventDispatcher !== undefined;
  }
}