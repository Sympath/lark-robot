export interface AuthResult {
    isValid: boolean;
    error?: string;
    payload?: any;
}
export declare class AuthService {
    private readonly verificationToken;
    private readonly appSecret;
    private readonly config;
    constructor();
    validateToken(payload: any): AuthResult;
    validateSignature(req: any): AuthResult;
    validateUrlVerification(payload: any): AuthResult;
    validateEventCallback(payload: any): AuthResult;
    validateRequest(req: any): AuthResult;
    generateNonce(): string;
    generateTimestamp(): string;
}
//# sourceMappingURL=AuthService.d.ts.map