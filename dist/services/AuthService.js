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
        this.config = auth_1.default;
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
    validateSignature(req) {
        try {
            const timestamp = req.headers['x-lark-request-timestamp'];
            const nonce = req.headers['x-lark-request-nonce'];
            const signature = req.headers['x-lark-signature'];
            if (!timestamp || !nonce || !signature) {
                return {
                    isValid: false,
                    error: 'Missing required headers: x-lark-request-timestamp, x-lark-request-nonce, x-lark-signature'
                };
            }
            const body = JSON.stringify(req.body);
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
                payload: req.body
            };
        }
        catch (error) {
            return {
                isValid: false,
                error: `Signature validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
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
    validateRequest(req) {
        try {
            const payload = req.body;
            if (!payload) {
                return {
                    isValid: false,
                    error: 'Empty request body'
                };
            }
            if (this.config.enableTokenValidation) {
                const tokenResult = this.validateToken(payload);
                if (!tokenResult.isValid) {
                    return tokenResult;
                }
            }
            if (this.config.enableSignatureValidation) {
                const signatureResult = this.validateSignature(req);
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