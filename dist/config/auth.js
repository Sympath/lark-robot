"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authConfig = {
    appId: process.env.FEISHU_APP_ID || 'cli_a8079e4490b81013',
    appSecret: process.env.FEISHU_APP_SECRET || 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
    verificationToken: process.env.FEISHU_VERIFICATION_TOKEN || 'glqekPS9pO55cF0bHfSEZbogArkR8inu',
    encryptKey: process.env.FEISHU_ENCRYPT_KEY || 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb',
    enableSignatureValidation: process.env.ENABLE_SIGNATURE_VALIDATION === 'true',
    enableTokenValidation: process.env.ENABLE_TOKEN_VALIDATION !== 'false',
    enableEncryption: process.env.ENABLE_ENCRYPTION !== 'false',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false',
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
    tokenCacheTimeout: parseInt(process.env.TOKEN_CACHE_TIMEOUT || '3600000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.RETRY_DELAY || '1000'),
};
exports.default = authConfig;
//# sourceMappingURL=auth.js.map