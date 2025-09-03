import Koa from 'koa';
import { WebhookPayload, MessageRequest } from '../types';
import { LogService } from '../services/LogService';
import { LarkService } from '../services/LarkService';
import { AuthService } from '../services/AuthService';
import { EventDispatcherService } from '../services/EventDispatcherService';
import * as lark from '@larksuiteoapi/node-sdk';

export class WebhookController {
  private logService: LogService;
  private larkService: LarkService;
  private authService: AuthService;
  private eventDispatcherService: EventDispatcherService;

  constructor(logService: LogService) {
    this.logService = logService;
    this.larkService = new LarkService();
    this.authService = new AuthService();
    this.eventDispatcherService = new EventDispatcherService(logService);
  }

  // 专门处理飞书 URL 验证的端点
  public async handleUrlVerification(ctx: Koa.Context): Promise<void> {
    try {
      const payload = ctx.request.body;
      console.log('🔍 URL 验证请求:', JSON.stringify(payload, null, 2));
      
      // 使用鉴权服务验证请求
      const authResult = this.authService.validateUrlVerification(payload);
      
      if (!authResult.isValid) {
        console.error('❌ URL 验证失败:', authResult.error);
        this.logService.addLog('error', 'URL verification failed', { error: authResult.error });
        ctx.status = 401;
        ctx.body = { error: authResult.error };
        return;
      }

      console.log('✅ URL 验证成功，challenge:', authResult.payload.challenge);
      this.logService.addLog('info', 'URL verification successful', { 
        challenge: authResult.payload.challenge,
        timestamp: new Date().toISOString()
      });
      
      // 返回正确的 JSON 格式
      ctx.set('Content-Type', 'application/json');
      ctx.body = { challenge: authResult.payload.challenge };
    } catch (error) {
      console.error('URL 验证失败:', error);
      this.logService.addLog('error', 'URL verification error', error instanceof Error ? error.message : 'Unknown error');
      ctx.status = 500;
      ctx.body = { error: 'Verification failed' };
    }
  }

  // 使用 EventDispatcher 处理 webhook 请求
  public async handleCallbackWithEventDispatcher(ctx: Koa.Context): Promise<void> {
    try {
      console.log('🔍 使用 EventDispatcher 处理 webhook 请求');
      
      if (!this.eventDispatcherService.isInitialized()) {
        console.error('❌ EventDispatcher 未初始化');
        ctx.status = 500;
        ctx.body = { error: 'EventDispatcher not initialized' };
        return;
      }

      // 使用 EventDispatcher 处理请求
      await this.eventDispatcherService.handleWebhookRequest(ctx);
      
    } catch (error) {
      console.error('❌ EventDispatcher 处理失败:', error);
      this.logService.addLog('error', 'EventDispatcher processing failed', error instanceof Error ? error.message : 'Unknown error');
      ctx.status = 500;
      ctx.body = { error: 'EventDispatcher processing failed' };
    }
  }

  public async handleCallback(ctx: Koa.Context): Promise<void> {
    try {
      // 使用鉴权服务验证请求
      const authResult = this.authService.validateRequest(ctx);
      
      if (!authResult.isValid) {
        console.error('❌ 请求验证失败:', authResult.error);
        this.logService.addLog('error', 'Request validation failed', { error: authResult.error });
        ctx.status = 401;
        ctx.body = { error: authResult.error };
        return;
      }

      console.log('✅ 请求验证成功');
      this.logService.addLog('info', 'Request validation successful');

      // 获取验证后的有效载荷
      const payload: WebhookPayload = authResult.payload || ctx.request.body;
      
      this.logService.addLog('info', 'callback received', payload);
      console.log('🔍 收到 webhook 请求:', JSON.stringify(payload, null, 2));

      // 处理 URL 验证
      if (payload.type === 'url_verification') {
        this.logService.addLog('info', 'URL verification successful');
        ctx.body = { challenge: payload.challenge };
        return;
      }

      // 处理事件回调 - 飞书使用 schema 2.0 格式
      if (payload.schema === '2.0' && payload.event) {
        const event = payload.event;
        console.log('🔍 事件详情:', JSON.stringify(event, null, 2));
        console.log('🔍 事件类型:', event.type);
        console.log('🔍 事件键:', Object.keys(event));
        
        this.logService.addLog('info', `Event received: ${event.type}`, event);

        try {
          console.log('🔍 开始处理事件类型:', event.type);
          
          // 根据事件类型处理
          switch (event.type) {
            case 'message':
              console.log('📝 处理消息事件');
              this.logService.addLog('info', 'Message event processed', event);
              // 自动回复消息
              await this.autoReplyToMessage(event);
              break;
            
            case 'user_added':
              console.log('👤 处理用户添加事件');
              this.logService.addLog('info', 'User added event processed', event);
              // 发送欢迎消息
              await this.sendWelcomeMessage(event);
              break;
            
            case 'user_removed':
              console.log('👤 处理用户移除事件');
              this.logService.addLog('info', 'User removed event processed', event);
              break;
            
            case 'interactive':
              console.log('🔘 处理交互事件');
              this.logService.addLog('info', 'Interactive event processed', event);
              // 处理卡片按钮点击
              await this.handleCardInteraction(event);
              break;
            
            case 'card.action.trigger':
              console.log('🔘 处理卡片动作触发事件');
              this.logService.addLog('info', 'Card action trigger event processed', event);
              // 处理卡片按钮点击
              await this.handleCardInteraction(event);
              break;
            
            default:
              console.log('❓ 未知事件类型:', event.type);
              this.logService.addLog('info', `Unknown event type: ${event.type}`, event);
              // 如果没有明确的类型，但有 action，也当作卡片交互处理
              if (event.action) {
                console.log('🔍 检测到 action，当作卡片交互处理');
                await this.handleCardInteraction(event);
              }
          }

          console.log('✅ 事件处理完成，返回成功响应');
          ctx.body = { success: true };
          return;
        } catch (error) {
          console.error('❌ 事件处理过程中发生错误:', error);
          this.logService.addLog('error', 'Event processing failed', error instanceof Error ? error.message : 'Unknown error');
          // 即使处理失败，也返回成功响应，避免飞书重试
          ctx.body = { success: true, error: error instanceof Error ? error.message : 'Unknown error' };
          return;
        }
      }

      // 处理旧格式的事件回调
      if (payload.type === 'event_callback' && payload.event) {
        const event = payload.event;
        this.logService.addLog('info', `Event received (old format): ${event.type}`, event);

        try {
          // 根据事件类型处理
          switch (event.type) {
            case 'message':
              this.logService.addLog('info', 'Message event processed', event);
              // 自动回复消息
              await this.autoReplyToMessage(event);
              break;
            
            case 'user_added':
              this.logService.addLog('info', 'User added event processed', event);
              // 发送欢迎消息
              await this.sendWelcomeMessage(event);
              break;
            
            case 'user_removed':
              this.logService.addLog('info', 'User removed event processed', event);
              break;
            
            case 'interactive':
              this.logService.addLog('info', 'Interactive event processed', event);
              // 处理卡片按钮点击
              await this.handleCardInteraction(event);
              break;
            
            case 'card.action.trigger':
              this.logService.addLog('info', 'Card action trigger event processed', event);
              // 处理卡片按钮点击
              await this.handleCardInteraction(event);
              break;
            
            default:
              this.logService.addLog('info', `Unknown event type: ${event.type}`, event);
              // 如果没有明确的类型，但有 action，也当作卡片交互处理
              if (event.action) {
                console.log('🔍 检测到 action，当作卡片交互处理');
                await this.handleCardInteraction(event);
              }
          }

          console.log('✅ 旧格式事件处理完成，返回成功响应');
          ctx.body = { success: true };
          return;
        } catch (error) {
          console.error('❌ 旧格式事件处理过程中发生错误:', error);
          this.logService.addLog('error', 'Old format event processing failed', error instanceof Error ? error.message : 'Unknown error');
          // 即使处理失败，也返回成功响应，避免飞书重试
          ctx.body = { success: true, error: error instanceof Error ? error.message : 'Unknown error' };
          return;
        }
      }

      // 如果没有匹配的格式，返回错误
      ctx.status = 400;
      ctx.body = { error: 'Invalid webhook payload' };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      ctx.status = 500;
      ctx.body = { error: 'Webhook processing failed' };
    }
  }

  public getCallbackInfo(ctx: Koa.Context): void {
    console.log('callback received', ctx.request.body);
    ctx.body = { 
      message: 'Webhook endpoint is ready',
      status: 'active',
      timestamp: new Date().toISOString(),
      ...(ctx.request.body as any)
    };
  }

  // 自动回复消息
  private async autoReplyToMessage(event: any): Promise<void> {
    try {
      if (event.message && event.message.content) {
        const messageRequest: MessageRequest = {
          receive_id: event.message.chat_id,
          receive_id_type: 'chat_id',
          content: JSON.stringify({ text: '收到你的消息了！' }),
          msg_type: 'text'
        };

        await this.larkService.sendMessage(messageRequest);
        this.logService.addLog('info', 'Auto reply sent successfully');
      }
    } catch (error) {
      this.logService.addLog('error', 'Failed to send auto reply', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // 发送欢迎消息
  private async sendWelcomeMessage(event: any): Promise<void> {
    try {
      if (event.operator_id && event.operator_id.open_id) {
        const messageRequest: MessageRequest = {
          receive_id: event.operator_id.open_id,
          receive_id_type: 'open_id',
          content: JSON.stringify({ text: '欢迎加入！我是你的飞书助手。' }),
          msg_type: 'text'
        };

        await this.larkService.sendMessage(messageRequest);
        this.logService.addLog('info', 'Welcome message sent successfully');
      }
    } catch (error) {
      this.logService.addLog('error', 'Failed to send welcome message', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // 处理卡片交互事件
  private async handleCardInteraction(event: any): Promise<void> {
    try {
      console.log('🔘 卡片交互事件:', JSON.stringify(event, null, 2));
      
      // 飞书交互事件的格式
      let buttonValue = null;
      let userId = null;
      let chatId = null;
      
      // 处理不同的交互事件格式
      if (event.action && event.action.value) {
        // 直接格式
        buttonValue = event.action.value;
        userId = event.user_id || event.open_id || event.operator?.user_id;
        chatId = event.chat_id || event.context?.open_chat_id;
      } else if (event.interactive && event.interactive.action) {
        // 嵌套格式
        buttonValue = event.interactive.action.value;
        userId = event.user_id || event.open_id || event.operator?.user_id;
        chatId = event.chat_id || event.context?.open_chat_id;
      } else if (event.message && event.message.interactive) {
        // 消息中的交互格式
        buttonValue = event.message.interactive.action.value;
        userId = event.user_id || event.open_id || event.operator?.user_id;
        chatId = event.message.chat_id || event.context?.open_chat_id;
      }
      
      if (buttonValue) {
        const logData = {
          timestamp: new Date().toISOString(),
          buttonValue,
          userId,
          chatId,
          action: event.action || event.interactive?.action || event.message?.interactive?.action,
          eventType: 'card_interaction'
        };
        
        this.logService.addLog('info', 'Card button clicked', logData);
        
        // 输出到文件日志
        const fs = require('fs');
        const logEntry = `${new Date().toISOString()} - 卡片按钮点击: ${JSON.stringify(logData, null, 2)}\n`;
        fs.appendFileSync('card_interactions.log', logEntry);
        
        console.log('📝 日志已写入文件: card_interactions.log');

        // 根据按钮值处理不同的操作
        let replyMessage = '';
        let toastMessage = '';
        
        switch (buttonValue.key) {
          case 'test':
            replyMessage = '🎯 你点击了测试按钮！';
            toastMessage = '测试操作成功';
            break;
          case 'confirm':
            replyMessage = '✅ 你点击了确认按钮！';
            toastMessage = '操作已确认';
            break;
          case 'cancel':
            replyMessage = '❌ 你点击了取消按钮！';
            toastMessage = '操作已取消';
            break;
          case 'primary':
            replyMessage = '🎯 你点击了主要操作按钮！';
            toastMessage = '主要操作执行中';
            break;
          case 'secondary':
            replyMessage = '📝 你点击了次要操作按钮！';
            toastMessage = '次要操作执行中';
            break;
          default:
            replyMessage = `🔘 你点击了按钮，参数: ${JSON.stringify(buttonValue)}`;
            toastMessage = '按钮点击成功';
        }

        // 发送回复消息
        const messageRequest: MessageRequest = {
          receive_id: chatId,
          receive_id_type: 'chat_id',
          content: JSON.stringify({ text: replyMessage }),
          msg_type: 'text'
        };

        await this.larkService.sendMessage(messageRequest);
        
        // 发送用户通知
        await this.sendUserNotification(userId, toastMessage);
        
        // 发送Toast通知
        await this.sendToastNotification(userId, toastMessage);
        
        this.logService.addLog('info', 'Card interaction reply sent', { replyMessage, toastMessage });
        
      } else {
        this.logService.addLog('warn', 'Card interaction without action value', event);
        console.log('⚠️ 未找到按钮值，事件格式:', JSON.stringify(event, null, 2));
      }
    } catch (error) {
      this.logService.addLog('error', 'Failed to handle card interaction', error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ 处理卡片交互失败:', error);
    }
  }

  // 发送用户通知消息
  private async sendUserNotification(userId: string, message: string): Promise<void> {
    try {
      if (!this.larkService.isSDKLoaded()) {
        console.log('⚠️ SDK 未加载，跳过通知发送');
        return;
      }

      // 发送私聊消息给用户
      const messageRequest: MessageRequest = {
        receive_id: userId,
        receive_id_type: 'user_id',
        content: JSON.stringify({ text: `🔔 ${message}` }),
        msg_type: 'text'
      };

      await this.larkService.sendMessage(messageRequest);
      console.log('✅ 用户通知发送成功:', message);
      
      // 记录到日志文件
      const fs = require('fs');
      const notificationLog = `${new Date().toISOString()} - 用户通知: ${message} -> 用户: ${userId}\n`;
      fs.appendFileSync('user_notifications.log', notificationLog);
      
    } catch (error) {
      console.error('❌ 发送用户通知失败:', error);
      
      // 记录错误到日志文件
      const fs = require('fs');
      const errorLog = `${new Date().toISOString()} - 用户通知发送失败: ${error instanceof Error ? error.message : 'Unknown error'} -> 用户: ${userId}\n`;
      fs.appendFileSync('notification_errors.log', errorLog);
    }
  }

  // 发送Toast通知
  private async sendToastNotification(userId: string, message: string): Promise<void> {
    try {
      if (!this.larkService.isSDKLoaded()) {
        console.log('⚠️ SDK 未加载，跳过toast通知发送');
        return;
      }

      // 使用飞书SDK发送toast通知
      const lark = require('@larksuiteoapi/node-sdk');
      const client = new lark.Client({
        appId: 'cli_a8079e4490b81013',
        appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
      });

      // 发送toast通知
      await client.im.message.create({
        params: {
          receive_id_type: 'user_id',
        },
        data: {
          receive_id: userId,
          content: JSON.stringify({ 
            text: `🔔 ${message}`,
            toast: {
              text: message,
              type: 'success'
            }
          }),
          msg_type: 'text',
        },
      });

      console.log('✅ Toast通知发送成功:', message);
      
      // 记录到toast日志文件
      const fs = require('fs');
      const toastLog = `${new Date().toISOString()} - Toast 提醒: ${message} -> 用户: ${userId}\n`;
      fs.appendFileSync('toast_notifications.log', toastLog);
      
    } catch (error) {
      console.error('❌ 发送Toast通知失败:', error);
      
      // 记录错误到日志文件
      const fs = require('fs');
      const errorLog = `${new Date().toISOString()} - Toast通知发送失败: ${error instanceof Error ? error.message : 'Unknown error'} -> 用户: ${userId}\n`;
      fs.appendFileSync('toast_errors.log', errorLog);
    }
  }

  /**
   * 获取 Koa 适配器
   */
  public getKoaAdapter() {
    const eventDispatcher = this.eventDispatcherService.getEventDispatcher();
    return async (ctx: Koa.Context) => {
      try {
        // 构造 EventDispatcher 需要的数据格式
        const eventData = {
          body: ctx.request.body,
          headers: ctx.headers
        };

        // 使用 EventDispatcher 处理请求
        const result = await eventDispatcher.invoke(eventData);
        
        // 设置响应
        ctx.body = result;
      } catch (error) {
        console.error('❌ EventDispatcher 处理失败:', error);
        ctx.status = 500;
        ctx.body = { error: 'EventDispatcher processing failed' };
      }
    };
  }

  /**
   * 获取 Express 适配器（兼容性保留）
   */
  public getExpressAdapter() {
    const eventDispatcher = this.eventDispatcherService.getEventDispatcher();
    return lark.adaptExpress(eventDispatcher, {
      autoChallenge: true
    });
  }
} 