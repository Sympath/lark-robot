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
    private decryptData;
    validateToken(payload: any): AuthResult;
    validateSignature(ctx: Koa.Context): AuthResult;
    validateEncryptedRequest(ctx: Koa.Context): AuthResult;
    validateUrlVerification(payload: any): AuthResult;
    validateEventCallback(payload: any): AuthResult;
    validateRequest(ctx: Koa.Context): AuthResult;
    generateNonce(): string;
    generateTimestamp(): string;
}
//# sourceMappingURL=AuthService.d.ts.map