export interface AuthConfig {
    appId: string;
    appSecret: string;
    verificationToken: string;
    encryptKey: string;
    enableSignatureValidation: boolean;
    enableTokenValidation: boolean;
    enableEncryption: boolean;
    enableRequestLogging: boolean;
    requestTimeout: number;
    tokenCacheTimeout: number;
    maxRetries: number;
    retryDelay: number;
}
declare const authConfig: AuthConfig;
export default authConfig;
//# sourceMappingURL=auth.d.ts.map