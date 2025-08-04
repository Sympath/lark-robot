import { Request, Response, NextFunction } from 'express';
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
  public validateFeishuWebhook(req: Request, res: Response, next: NextFunction): void {
    try {
      console.log('🔐 开始验证飞书 Webhook 请求');
      
      // 验证请求
      const authResult = this.authService.validateRequest(req);
      
      if (!authResult.isValid) {
        console.error('❌ Webhook 验证失败:', authResult.error);
        this.logService.addLog('error', 'Webhook validation failed', { 
          error: authResult.error,
          headers: req.headers,
          body: req.body
        });
        
        res.status(401).json({ 
          error: authResult.error,
          timestamp: new Date().toISOString()
        });
        return;
      }

      console.log('✅ Webhook 验证成功');
      this.logService.addLog('info', 'Webhook validation successful', {
        type: req.body.type || req.body.schema,
        timestamp: new Date().toISOString()
      });

      // 将验证结果添加到请求对象中
      (req as any).authResult = authResult;
      
      next();
    } catch (error) {
      console.error('❌ 鉴权中间件错误:', error);
      this.logService.addLog('error', 'Auth middleware error', error instanceof Error ? error.message : 'Unknown error');
      
      res.status(500).json({ 
        error: 'Authentication service error',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 验证签名（可选，用于更严格的安全验证）
   */
  public validateSignature(req: Request, res: Response, next: NextFunction): void {
    try {
      console.log('🔐 开始验证请求签名');
      
      const authResult = this.authService.validateSignature(req);
      
      if (!authResult.isValid) {
        console.error('❌ 签名验证失败:', authResult.error);
        this.logService.addLog('error', 'Signature validation failed', { 
          error: authResult.error,
          headers: req.headers
        });
        
        res.status(401).json({ 
          error: authResult.error,
          timestamp: new Date().toISOString()
        });
        return;
      }

      console.log('✅ 签名验证成功');
      this.logService.addLog('info', 'Signature validation successful');
      
      next();
    } catch (error) {
      console.error('❌ 签名验证中间件错误:', error);
      this.logService.addLog('error', 'Signature middleware error', error instanceof Error ? error.message : 'Unknown error');
      
      res.status(500).json({ 
        error: 'Signature validation service error',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 记录请求信息的中间件
   */
  public logRequest(req: Request, _res: Response, next: NextFunction): void {
    const requestInfo = {
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
        'x-lark-request-timestamp': req.headers['x-lark-request-timestamp'],
        'x-lark-request-nonce': req.headers['x-lark-request-nonce'],
        'x-lark-signature': req.headers['x-lark-signature'] ? '***' : undefined
      },
      body: req.body,
      timestamp: new Date().toISOString()
    };

    console.log('📝 收到请求:', JSON.stringify(requestInfo, null, 2));
    this.logService.addLog('info', 'Request received', requestInfo);
    
    next();
  }

  /**
   * 错误处理中间件
   */
  public errorHandler(error: Error, req: Request, res: Response, _next: NextFunction): void {
    console.error('❌ 请求处理错误:', error);
    this.logService.addLog('error', 'Request processing error', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });

    res.status(500).json({
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
} 