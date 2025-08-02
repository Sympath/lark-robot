import { Request, Response } from 'express';
import { WebhookPayload, MessageRequest } from '../types';
import { LogService } from '../services/LogService';
import { LarkService } from '../services/LarkService';

export class WebhookController {
  private logService: LogService;
  private larkService: LarkService;

  constructor(logService: LogService) {
    this.logService = logService;
    this.larkService = new LarkService();
  }

  public async handleCallback(req: Request, res: Response): Promise<void> {
    try {
      const payload: WebhookPayload = req.body;
      
      this.logService.addLog('info', 'callback received', payload);
      console.log('🔍 收到 webhook 请求:', JSON.stringify(payload, null, 2));

      // 处理 URL 验证
      if (payload.type === 'url_verification') {
        this.logService.addLog('info', 'URL verification successful');
        res.json({ challenge: payload.challenge });
        return;
      }

      // 处理事件回调 - 飞书使用 schema 2.0 格式
      if (payload.schema === '2.0' && payload.event) {
        const event = payload.event;
        console.log('🔍 事件详情:', JSON.stringify(event, null, 2));
        console.log('🔍 事件类型:', event.type);
        console.log('🔍 事件键:', Object.keys(event));
        
        this.logService.addLog('info', `Event received: ${event.type}`, event);

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

        res.json({ success: true });
        return;
      }

      // 处理旧格式的事件回调
      if (payload.type === 'event_callback' && payload.event) {
        const event = payload.event;
        this.logService.addLog('info', `Event received (old format): ${event.type}`, event);

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
          
          default:
            this.logService.addLog('info', `Unknown event type: ${event.type}`, event);
        }

        res.json({ success: true });
        return;
      }

      res.json({ success: true });
    } catch (error) {
      this.logService.addLog('error', 'Error processing webhook', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public getCallbackInfo(req: Request, res: Response): void {
    console.log('callback received', req.body);
    res.json({ 
      message: 'Webhook endpoint is ready',
      status: 'active',
      timestamp: new Date().toISOString(),
      ...req.body
    });
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
        
        // 发送 toast 提醒
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

  // 发送 toast 提醒
  private async sendToastNotification(userId: string, message: string): Promise<void> {
    try {
      if (!this.larkService.isSDKLoaded()) {
        console.log('⚠️ SDK 未加载，跳过 toast 发送');
        return;
      }

      // 使用飞书 SDK 发送 toast 提醒
      const lark = require('@larksuiteoapi/node-sdk');
      const client = new lark.Client({
        appId: 'cli_a8079e4490b81013',
        appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
      });

      // 发送 toast 消息
      const toastResult = await client.im.message.create({
        params: {
          receive_id_type: 'user_id',
        },
        data: {
          receive_id: userId,
          content: JSON.stringify({ 
            text: `🔔 ${message}`,
            elements: [
              {
                tag: "text",
                text: `🔔 ${message}`
              }
            ]
          }),
          msg_type: 'text',
        },
      });

      console.log('✅ Toast 提醒发送成功:', toastResult);
      
      // 记录到日志文件
      const fs = require('fs');
      const toastLog = `${new Date().toISOString()} - Toast 提醒: ${message} -> 用户: ${userId}\n`;
      fs.appendFileSync('toast_notifications.log', toastLog);
      
    } catch (error) {
      console.error('❌ 发送 toast 提醒失败:', error);
      
      // 记录错误到日志文件
      const fs = require('fs');
      const errorLog = `${new Date().toISOString()} - Toast 发送失败: ${error instanceof Error ? error.message : 'Unknown error'} -> 用户: ${userId}\n`;
      fs.appendFileSync('toast_errors.log', errorLog);
    }
  }
} 