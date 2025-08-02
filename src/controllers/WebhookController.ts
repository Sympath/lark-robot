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
      console.log('callback received', payload);

      // 处理 URL 验证
      if (payload.type === 'url_verification') {
        this.logService.addLog('info', 'URL verification successful');
        res.json({ challenge: payload.challenge });
        return;
      }

      // 处理事件回调
      if (payload.type === 'event_callback' && payload.event) {
        const event = payload.event;
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
} 