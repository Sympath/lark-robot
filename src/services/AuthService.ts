import crypto from 'crypto';
import Koa from 'koa';
import authConfig from '../config/auth';

export interface AuthResult {
  isValid: boolean;
  error?: string;
  payload?: any;
}

export class AuthService {
  private readonly verificationToken: string;
  private readonly appSecret: string;
  private readonly encryptKey: string;
  private readonly config: typeof authConfig;

  constructor() {
    this.verificationToken = authConfig.verificationToken;
    this.appSecret = authConfig.appSecret;
    this.encryptKey = authConfig.encryptKey;
    this.config = authConfig;
  }

  /**
   * 解密飞书加密的数据
   */
  private decryptData(encryptedData: string): string {
    try {
      // 解码 base64
      const encryptedBuffer = Buffer.from(encryptedData, 'base64');
      
      // 提取 IV（前16字节）
      const iv = encryptedBuffer.slice(0, 16);
      const ciphertext = encryptedBuffer.slice(16);
      
      // 使用 SHA256 对 Encrypt Key 进行哈希，得到密钥 key
      const key = crypto.createHash('sha256').update(this.encryptKey).digest();
      
      // 使用 AES-256-CBC 解密
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      decipher.setAutoPadding(false);
      
      let decrypted = decipher.update(ciphertext, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      // 移除 PKCS7 padding
      const paddingLength = decrypted.charCodeAt(decrypted.length - 1);
      if (paddingLength > 0 && paddingLength <= 16) {
        decrypted = decrypted.slice(0, decrypted.length - paddingLength);
      }
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
  public validateSignature(ctx: Koa.Context): AuthResult {
    try {
      const timestamp = ctx.headers['x-lark-request-timestamp'];
      const nonce = ctx.headers['x-lark-request-nonce'];
      const signature = ctx.headers['x-lark-signature'];

      // 检查必要的头部字段
      if (!timestamp || !nonce || !signature) {
        return {
          isValid: false,
          error: 'Missing required headers: x-lark-request-timestamp, x-lark-request-nonce, x-lark-signature'
        };
      }

      // 获取请求体
      const body = JSON.stringify(ctx.request.body);
      
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
        payload: ctx.request.body
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Signature validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 验证加密的请求
   */
  public validateEncryptedRequest(ctx: Koa.Context): AuthResult {
    try {
      const encryptedData = (ctx.request.body as any)?.encrypted_data || (ctx.request.body as any)?.encrypt;
      
      if (!encryptedData) {
        return {
          isValid: false,
          error: 'Missing encrypted_data or encrypt in request body'
        };
      }

      // 解密数据
      const decryptedData = this.decryptData(encryptedData);
      const payload = JSON.parse(decryptedData);

      // 验证解密后的数据
      if (payload.type === 'url_verification') {
        return this.validateUrlVerification(payload);
      } else if (payload.schema === '2.0') {
        return this.validateEventCallback(payload);
      } else {
        return {
          isValid: false,
          error: 'Invalid decrypted payload structure'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: `Encrypted request validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
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
  public validateRequest(ctx: Koa.Context): AuthResult {
    try {
      const payload = ctx.request.body;

      // 如果没有请求体，返回错误
      if (!payload) {
        return {
          isValid: false,
          error: 'Empty request body'
        };
      }

      // 检查是否是加密请求
      if ((payload as any).encrypted_data || (payload as any).encrypt) {
        if (this.config.enableEncryption) {
          return this.validateEncryptedRequest(ctx);
        } else {
          return {
            isValid: false,
            error: 'Encrypted request received but encryption is not enabled'
          };
        }
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
        const signatureResult = this.validateSignature(ctx);
        if (!signatureResult.isValid) {
          return signatureResult;
        }
      }

      // 根据请求类型进行验证
      if ((payload as any).type === 'url_verification') {
        return this.validateUrlVerification(payload);
      } else if ((payload as any).schema === '2.0') {
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