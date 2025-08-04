import crypto from 'crypto';
import authConfig from '../config/auth';

export interface AuthResult {
  isValid: boolean;
  error?: string;
  payload?: any;
}

export class AuthService {
  private readonly verificationToken: string;
  private readonly appSecret: string;
  private readonly config: typeof authConfig;

  constructor() {
    this.verificationToken = authConfig.verificationToken;
    this.appSecret = authConfig.appSecret;
    this.config = authConfig;
  }

  /**
   * 验证飞书 Webhook 请求的 Token
   */
  public validateToken(payload: any): AuthResult {
    try {
      // 检查是否有 token 字段
      if (!payload.token) {
        return {
          isValid: false,
          error: 'Missing token in payload'
        };
      }

      // 验证 token 是否匹配
      if (payload.token !== this.verificationToken) {
        return {
          isValid: false,
          error: 'Invalid verification token'
        };
      }

      return {
        isValid: true,
        payload
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Token validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 验证飞书 Webhook 请求的签名
   * 飞书使用 HMAC-SHA256 算法进行签名验证
   */
  public validateSignature(req: any): AuthResult {
    try {
      const timestamp = req.headers['x-lark-request-timestamp'];
      const nonce = req.headers['x-lark-request-nonce'];
      const signature = req.headers['x-lark-signature'];

      // 检查必要的头部字段
      if (!timestamp || !nonce || !signature) {
        return {
          isValid: false,
          error: 'Missing required headers: x-lark-request-timestamp, x-lark-request-nonce, x-lark-signature'
        };
      }

      // 获取请求体
      const body = JSON.stringify(req.body);
      
      // 构造签名字符串
      const signString = `${timestamp}\n${nonce}\n${body}\n`;
      
      // 使用 HMAC-SHA256 计算签名
      const expectedSignature = crypto
        .createHmac('sha256', this.appSecret)
        .update(signString, 'utf8')
        .digest('base64');

      // 验证签名
      if (signature !== expectedSignature) {
        return {
          isValid: false,
          error: 'Invalid signature'
        };
      }

      return {
        isValid: true,
        payload: req.body
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Signature validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 验证 URL 验证请求
   */
  public validateUrlVerification(payload: any): AuthResult {
    try {
      // 检查是否是 URL 验证请求
      if (payload.type !== 'url_verification') {
        return {
          isValid: false,
          error: 'Not a URL verification request'
        };
      }

      // 验证 challenge 字段
      if (!payload.challenge) {
        return {
          isValid: false,
          error: 'Missing challenge in URL verification request'
        };
      }

      // 验证 token
      const tokenResult = this.validateToken(payload);
      if (!tokenResult.isValid) {
        return tokenResult;
      }

      return {
        isValid: true,
        payload
      };
    } catch (error) {
      return {
        isValid: false,
        error: `URL verification error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 验证事件回调请求
   */
  public validateEventCallback(payload: any): AuthResult {
    try {
      // 检查是否是事件回调
      if (!payload.schema || payload.schema !== '2.0') {
        return {
          isValid: false,
          error: 'Invalid schema version'
        };
      }

      // 检查是否有事件数据
      if (!payload.event) {
        return {
          isValid: false,
          error: 'Missing event data'
        };
      }

      // 验证 header 中的 token
      if (payload.header && payload.header.token) {
        const tokenResult = this.validateToken({ token: payload.header.token });
        if (!tokenResult.isValid) {
          return tokenResult;
        }
      }

      return {
        isValid: true,
        payload
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Event callback validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 综合验证方法
   */
  public validateRequest(req: any): AuthResult {
    try {
      const payload = req.body;

      // 如果没有请求体，返回错误
      if (!payload) {
        return {
          isValid: false,
          error: 'Empty request body'
        };
      }

      // 根据配置决定是否进行 Token 验证
      if (this.config.enableTokenValidation) {
        const tokenResult = this.validateToken(payload);
        if (!tokenResult.isValid) {
          return tokenResult;
        }
      }

      // 根据配置决定是否进行签名验证
      if (this.config.enableSignatureValidation) {
        const signatureResult = this.validateSignature(req);
        if (!signatureResult.isValid) {
          return signatureResult;
        }
      }

      // 根据请求类型进行验证
      if (payload.type === 'url_verification') {
        return this.validateUrlVerification(payload);
      } else if (payload.schema === '2.0') {
        return this.validateEventCallback(payload);
      } else {
        return {
          isValid: false,
          error: 'Unknown request type'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: `Request validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 生成安全的随机字符串
   */
  public generateNonce(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * 生成时间戳
   */
  public generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }
} 