import { Request, Response } from 'express';
import { MessageRequest } from '../types';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';

export class MessageController {
  private larkService: LarkService;
  private logService: LogService;

  constructor(larkService: LarkService, logService: LogService) {
    this.larkService = larkService;
    this.logService = logService;
  }

  public async sendDefaultMessage(_req: Request, res: Response): Promise<void> {
    try {
      // 直接测试 SDK，绕过 LarkService
      const lark = require('@larksuiteoapi/node-sdk');
      const client = new lark.Client({
        appId: 'cli_a8079e4490b81013',
        appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
      });

      console.log('🔍 直接 SDK 测试:');
      console.log('- client 类型:', typeof client);
      console.log('- client.im 类型:', typeof client.im);
      console.log('- client.im.message 类型:', typeof client.im.message);
      console.log('- client.im.message.create 类型:', typeof client.im.message.create);

      const result = await client.im.message.create({
        params: {
          receive_id_type: 'user_id',
        },
        data: {
          receive_id: 'c5bf39fa',
          content: JSON.stringify({ text: 'hello world' }),
          msg_type: 'text',
        },
      });

      console.log('✅ 直接 SDK 调用成功:', result);
      
      this.logService.addLog('info', 'Direct SDK message sent successfully', result);
      
      res.json({ 
        success: true, 
        message: 'Direct SDK message sent successfully',
        data: result
      });
    } catch (error) {
      this.logService.addLog('error', 'Error sending direct SDK message', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public async sendCustomMessage(req: Request, res: Response): Promise<void> {
    try {
      const { receive_id, template_id, template_variable, receive_id_type = 'user_id', content, msg_type = 'text' } = req.body;
      
      // 如果是卡片消息，直接使用 SDK 发送
      if (msg_type === 'interactive') {
        const lark = require('@larksuiteoapi/node-sdk');
        const client = new lark.Client({
          appId: 'cli_a8079e4490b81013',
          appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
        });

        const result = await client.im.message.create({
          params: {
            receive_id_type: receive_id_type,
          },
          data: {
            receive_id: receive_id,
            content: content,
            msg_type: 'interactive',
          },
        });

        this.logService.addLog('info', 'Interactive message sent successfully', result);
        
        res.json({ 
          success: true, 
          message: 'Interactive message sent successfully',
          data: result
        });
        return;
      }
      
      // 如果是模板消息，使用 sendCardMessage
      if (template_id) {
        const messageRequest: MessageRequest = {
          receive_id,
          template_id,
          template_variable: template_variable || {},
          receive_id_type
        };

        const response = await this.larkService.sendCardMessage(messageRequest);
        
        this.logService.addLog('info', 'Custom message sent successfully', response);
        
        res.json({ 
          success: true, 
          message: 'Custom message sent successfully',
          data: response
        });
        return;
      }

      // 默认文本消息
      const messageRequest: MessageRequest = {
        receive_id,
        content: content || JSON.stringify({ text: 'default message' }),
        msg_type: msg_type,
        receive_id_type
      };

      const response = await this.larkService.sendMessage(messageRequest);
      
      this.logService.addLog('info', 'Custom message sent successfully', response);
      
      res.json({ 
        success: true, 
        message: 'Custom message sent successfully',
        data: response
      });
    } catch (error) {
      this.logService.addLog('error', 'Error sending custom message', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).json({ 
        success: false, 
        error: 'Failed to send custom message',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public async testSDKDirect(_req: Request, res: Response): Promise<void> {
    try {
      // 直接测试 SDK，绕过 LarkService
      const lark = require('@larksuiteoapi/node-sdk');
      const client = new lark.Client({
        appId: 'cli_a8079e4490b81013',
        appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
      });

      console.log('🔍 直接 SDK 测试:');
      console.log('- client 类型:', typeof client);
      console.log('- client.im 类型:', typeof client.im);
      console.log('- client.im.message 类型:', typeof client.im.message);
      console.log('- client.im.message.create 类型:', typeof client.im.message.create);

      const result = await client.im.message.create({
        params: {
          receive_id_type: 'user_id',
        },
        data: {
          receive_id: 'c5bf39fa',
          content: JSON.stringify({ text: 'test from direct SDK' }),
          msg_type: 'text',
        },
      });

      res.json({ 
        success: true, 
        message: 'Direct SDK test successful',
        data: result
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  public getMessageInfo(_req: Request, res: Response): void {
    res.json({ 
      message: 'Message API endpoint is ready',
      endpoints: {
        'PUT /api/message': 'Send default test message',
        'POST /api/message': 'Send custom message with body parameters',
        'GET /api/message/test': 'Test SDK directly'
      },
      example: {
        method: 'POST',
        body: {
          receive_id: 'user_id',
          template_id: 'template_id',
          template_variable: {},
          receive_id_type: 'user_id'
        }
      },
      defaultParams: {
        receive_id: 'g4184fg9',
        template_id: 'ctp_AAzwhCwCTRyT',
        template_variable: {},
        receive_id_type: 'user_id'
      }
    });
  }
} 