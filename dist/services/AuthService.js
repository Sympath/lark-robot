"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const auth_1 = __importDefault(require("../config/auth"));
class AuthService {
    constructor() {
        this.verificationToken = auth_1.default.verificationToken;
        this.appSecret = auth_1.default.appSecret;
        this.encryptKey = auth_1.default.encryptKey;
        this.config = auth_1.default;
    }
    decryptData(encryptedData) {
        try {
            const encryptedBuffer = Buffer.from(encryptedData, 'base64');
            const iv = encryptedBuffer.slice(0, 16);
            const ciphertext = encryptedBuffer.slice(16);
            const key = crypto_1.default.createHash('sha256').update(this.encryptKey).digest();
            const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', key, iv);
            decipher.setAutoPadding(false);
            let decrypted = decipher.update(ciphertext, undefined, 'utf8');
            decrypted += decipher.final('utf8');
            const paddingLength = decrypted.charCodeAt(decrypted.length - 1);
            if (paddingLength > 0 && paddingLength <= 16) {
                decrypted = decrypted.slice(0, decrypted.length - paddingLength);
            }
            return decrypted;
        }
        catch (error) {
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    validateToken(payload) {
        try {
            if (!payload.token) {
                return {
                    isValid: false,
                    error: 'Missing token in payload'
                };
            }
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
        }
        catch (error) {
            return {
                isValid: false,
                error: `Token validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    validateSignature(ctx) {
        try {
            const timestamp = ctx.headers['x-lark-request-timestamp'];
            const nonce = ctx.headers['x-lark-request-nonce'];
            const signature = ctx.headers['x-lark-signature'];
            if (!timestamp || !nonce || !signature) {
                return {
                    isValid: false,
                    error: 'Missing required headers: x-lark-request-timestamp, x-lark-request-nonce, x-lark-signature'
                };
            }
            const body = JSON.stringify(ctx.request.body);
            const signString = `${timestamp}\n${nonce}\n${body}\n`;
            const expectedSignature = crypto_1.default
                .createHmac('sha256', this.appSecret)
                .update(signString, 'utf8')
                .digest('base64');
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
        }
        catch (error) {
            return {
                isValid: false,
                error: `Signature validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    validateEncryptedRequest(ctx) {
        try {
            const encryptedData = ctx.request.body?.encrypted_data || ctx.request.body?.encrypt;
            if (!encryptedData) {
                return {
                    isValid: false,
                    error: 'Missing encrypted_data or encrypt in request body'
                };
            }
            const decryptedData = this.decryptData(encryptedData);
            const payload = JSON.parse(decryptedData);
            if (payload.type === 'url_verification') {
                return this.validateUrlVerification(payload);
            }
            else if (payload.schema === '2.0') {
                return this.validateEventCallback(payload);
            }
            else {
                return {
                    isValid: false,
                    error: 'Invalid decrypted payload structure'
                };
            }
        }
        catch (error) {
            return {
                isValid: false,
                error: `Encrypted request validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    validateUrlVerification(payload) {
        try {
            if (payload.type !== 'url_verification') {
                return {
                    isValid: false,
                    error: 'Not a URL verification request'
                };
            }
            if (!payload.challenge) {
                return {
                    isValid: false,
                    error: 'Missing challenge in URL verification request'
                };
            }
            const tokenResult = this.validateToken(payload);
            if (!tokenResult.isValid) {
                return tokenResult;
            }
            return {
                isValid: true,
                payload
            };
        }
        catch (error) {
            return {
                isValid: false,
                error: `URL verification error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    validateEventCallback(payload) {
        try {
            if (!payload.schema || payload.schema !== '2.0') {
                return {
                    isValid: false,
                    error: 'Invalid schema version'
                };
            }
            if (!payload.event) {
                return {
                    isValid: false,
                    error: 'Missing event data'
                };
            }
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
        }
        catch (error) {
            return {
                isValid: false,
                error: `Event callback validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    validateRequest(ctx) {
        try {
            const payload = ctx.request.body;
            if (!payload) {
                return {
                    isValid: false,
                    error: 'Empty request body'
                };
            }
            if (payload.encrypted_data || payload.encrypt) {
                if (this.config.enableEncryption) {
                    return this.validateEncryptedRequest(ctx);
                }
                else {
                    return {
                        isValid: false,
                        error: 'Encrypted request received but encryption is not enabled'
                    };
                }
            }
            if (this.config.enableTokenValidation) {
                const tokenResult = this.validateToken(payload);
                if (!tokenResult.isValid) {
                    return tokenResult;
                }
            }
            if (this.config.enableSignatureValidation) {
                const signatureResult = this.validateSignature(ctx);
                if (!signatureResult.isValid) {
                    return signatureResult;
                }
            }
            if (payload.type === 'url_verification') {
                return this.validateUrlVerification(payload);
            }
            else if (payload.schema === '2.0') {
                return this.validateEventCallback(payload);
            }
            else {
                return {
                    isValid: false,
                    error: 'Unknown request type'
                };
            }
        }
        catch (error) {
            return {
                isValid: false,
                error: `Request validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    generateNonce() {
        return crypto_1.default.randomBytes(16).toString('hex');
    }
    generateTimestamp() {
        return Math.floor(Date.now() / 1000).toString();
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map