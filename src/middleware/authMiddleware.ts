import Koa from 'koa';
import { AuthService } from '../services/AuthService';
import { LogService } from '../services/LogService';

export class AuthMiddleware {
  private authService: AuthService;
  private logService: LogService;

  constructor() {
    this.authService = new AuthService();
    this.logService = new LogService();
  }

  /**
   * 验证飞书 Webhook 请求的中间件
   */
  public validateFeishuWebhook = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    try {
      console.log('🔐 开始验证飞书 Webhook 请求');
      
      // 验证请求
      const authResult = this.authService.validateRequest(ctx);
      
      if (!authResult.isValid) {
        console.error('❌ Webhook 验证失败:', authResult.error);
        this.logService.addLog('error', 'Webhook validation failed', { 
          error: authResult.error,
          headers: ctx.headers,
          body: ctx.request.body
        });
        
        ctx.status = 401;
        ctx.body = { 
          error: authResult.error,
          timestamp: new Date().toISOString()
        };
        return;
      }

      console.log('✅ Webhook 验证成功');
      this.logService.addLog('info', 'Webhook validation successful', {
        type: (ctx.request.body as any)?.type || (ctx.request.body as any)?.schema,
        timestamp: new Date().toISOString()
      });

      // 将验证结果添加到上下文对象中
      ctx.state.authResult = authResult;
      
      await next();
    } catch (error) {
      console.error('❌ 鉴权中间件错误:', error);
      this.logService.addLog('error', 'Auth middleware error', error instanceof Error ? error.message : 'Unknown error');
      
      ctx.status = 500;
      ctx.body = { 
        error: 'Authentication service error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 验证签名（可选，用于更严格的安全验证）
   */
  public validateSignature = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    try {
      console.log('🔐 开始验证请求签名');
      
      const authResult = this.authService.validateSignature(ctx);
      
      if (!authResult.isValid) {
        console.error('❌ 签名验证失败:', authResult.error);
        this.logService.addLog('error', 'Signature validation failed', { 
          error: authResult.error,
          headers: ctx.headers
        });
        
        ctx.status = 401;
        ctx.body = { 
          error: authResult.error,
          timestamp: new Date().toISOString()
        };
        return;
      }

      console.log('✅ 签名验证成功');
      this.logService.addLog('info', 'Signature validation successful');
      
      await next();
    } catch (error) {
      console.error('❌ 签名验证中间件错误:', error);
      this.logService.addLog('error', 'Signature middleware error', error instanceof Error ? error.message : 'Unknown error');
      
      ctx.status = 500;
      ctx.body = { 
        error: 'Signature validation service error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * 记录请求信息的中间件
   */
  public logRequest = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    const requestInfo = {
      method: ctx.method,
      url: ctx.url,
      headers: {
        'user-agent': ctx.headers['user-agent'],
        'content-type': ctx.headers['content-type'],
        'x-lark-request-timestamp': ctx.headers['x-lark-request-timestamp'],
        'x-lark-request-nonce': ctx.headers['x-lark-request-nonce'],
        'x-lark-signature': ctx.headers['x-lark-signature'] ? '***' : undefined
      },
      body: ctx.request.body,
      timestamp: new Date().toISOString()
    };

    console.log('📝 收到请求:', JSON.stringify(requestInfo, null, 2));
    this.logService.addLog('info', 'Request received', requestInfo);
    
    await next();
  }

  /**
   * 错误处理中间件
   */
  public errorHandler = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      console.error('❌ 请求处理错误:', error);
      this.logService.addLog('error', 'Request processing error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url: ctx.url,
        method: ctx.method,
        timestamp: new Date().toISOString()
      });

      ctx.status = 500;
      ctx.body = {
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      };
    }
  }
} 