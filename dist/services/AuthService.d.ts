import Koa from 'koa';
export interface AuthResult {
    isValid: boolean;
    error?: string;
    payload?: any;
}
export declare class AuthService {
    private readonly verificationToken;
    private readonly appSecret;
    private readonly encryptKey;
    private readonly config;
    constructor();
    /**
     * 解密飞书加密的数据
     */
    private decryptData;
    /**
     * 验证飞书 Webhook 请求的 Token
     */
    validateToken(payload: any): AuthResult;
    /**
     * 验证飞书 Webhook 请求的签名
     * 飞书使用 HMAC-SHA256 算法进行签名验证
     */
    validateSignature(ctx: Koa.Context): AuthResult;
    /**
     * 验证加密的请求
     */
    validateEncryptedRequest(ctx: Koa.Context): AuthResult;
    /**
     * 验证 URL 验证请求
     */
    validateUrlVerification(payload: any): AuthResult;
    /**
     * 验证事件回调请求
     */
    validateEventCallback(payload: any): AuthResult;
    /**
     * 综合验证方法
     */
    validateRequest(ctx: Koa.Context): AuthResult;
    /**
     * 生成安全的随机字符串
     */
    generateNonce(): string;
    /**
     * 生成时间戳
     */
    generateTimestamp(): string;
}
//# sourceMappingURL=AuthService.d.ts.map