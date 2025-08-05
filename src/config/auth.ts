export interface AuthConfig {
  // 飞书应用配置
  appId: string;
  appSecret: string;
  verificationToken: string;
  encryptKey: string;
  
  // 安全配置
  enableSignatureValidation: boolean;
  enableTokenValidation: boolean;
  enableEncryption: boolean;
  enableRequestLogging: boolean;
  
  // 超时配置
  requestTimeout: number;
  tokenCacheTimeout: number;
  
  // 重试配置
  maxRetries: number;
  retryDelay: number;
}

const authConfig: AuthConfig = {
  // 飞书应用配置
  appId: process.env.FEISHU_APP_ID || 'cli_a8079e4490b81013',
  appSecret: process.env.FEISHU_APP_SECRET || 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
  verificationToken: process.env.FEISHU_VERIFICATION_TOKEN || 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
  encryptKey: process.env.FEISHU_ENCRYPT_KEY || 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb',
  
  // 安全配置
  enableSignatureValidation: process.env.ENABLE_SIGNATURE_VALIDATION === 'true',
  enableTokenValidation: process.env.ENABLE_TOKEN_VALIDATION !== 'false', // 默认启用
  enableEncryption: process.env.ENABLE_ENCRYPTION !== 'false', // 默认启用
  enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false', // 默认启用
  
  // 超时配置（毫秒）
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
  tokenCacheTimeout: parseInt(process.env.TOKEN_CACHE_TIMEOUT || '3600000'), // 1小时
  
  // 重试配置
  maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
  retryDelay: parseInt(process.env.RETRY_DELAY || '1000'), // 1秒
};

export default authConfig; 