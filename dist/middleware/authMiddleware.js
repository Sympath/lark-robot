"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const AuthService_1 = require("../services/AuthService");
const LogService_1 = require("../services/LogService");
class AuthMiddleware {
    constructor() {
        this.validateFeishuWebhook = async (ctx, next) => {
            try {
                console.log('🔐 开始验证飞书 Webhook 请求');
                const authResult = this.authService.validateRequest(ctx);
                if (!authResult.isValid) {
                    console.error('❌ Webhook 验证失败:', authResult.error);
                    this.logService.addLog('error', 'Webhook validation failed', {
                        error: authResult.error,
                        headers: ctx.headers,
                        body: ctx.request.body
                    });
                    ctx.status = 401;
                    ctx.body = {
                        error: authResult.error,
                        timestamp: new Date().toISOString()
                    };
                    return;
                }
                console.log('✅ Webhook 验证成功');
                this.logService.addLog('info', 'Webhook validation successful', {
                    type: ctx.request.body?.type || ctx.request.body?.schema,
                    timestamp: new Date().toISOString()
                });
                ctx.state.authResult = authResult;
                await next();
            }
            catch (error) {
                console.error('❌ 鉴权中间件错误:', error);
                this.logService.addLog('error', 'Auth middleware error', error instanceof Error ? error.message : 'Unknown error');
                ctx.status = 500;
                ctx.body = {
                    error: 'Authentication service error',
                    timestamp: new Date().toISOString()
                };
            }
        };
        this.validateSignature = async (ctx, next) => {
            try {
                console.log('🔐 开始验证请求签名');
                const authResult = this.authService.validateSignature(ctx);
                if (!authResult.isValid) {
                    console.error('❌ 签名验证失败:', authResult.error);
                    this.logService.addLog('error', 'Signature validation failed', {
                        error: authResult.error,
                        headers: ctx.headers
                    });
                    ctx.status = 401;
                    ctx.body = {
                        error: authResult.error,
                        timestamp: new Date().toISOString()
                    };
                    return;
                }
                console.log('✅ 签名验证成功');
                this.logService.addLog('info', 'Signature validation successful');
                await next();
            }
            catch (error) {
                console.error('❌ 签名验证中间件错误:', error);
                this.logService.addLog('error', 'Signature middleware error', error instanceof Error ? error.message : 'Unknown error');
                ctx.status = 500;
                ctx.body = {
                    error: 'Signature validation service error',
                    timestamp: new Date().toISOString()
                };
            }
        };
        this.logRequest = async (ctx, next) => {
            const requestInfo = {
                method: ctx.method,
                url: ctx.url,
                headers: {
                    'user-agent': ctx.headers['user-agent'],
                    'content-type': ctx.headers['content-type'],
                    'x-lark-request-timestamp': ctx.headers['x-lark-request-timestamp'],
                    'x-lark-request-nonce': ctx.headers['x-lark-request-nonce'],
                    'x-lark-signature': ctx.headers['x-lark-signature'] ? '***' : undefined
                },
                body: ctx.request.body,
                timestamp: new Date().toISOString()
            };
            console.log('📝 收到请求:', JSON.stringify(requestInfo, null, 2));
            this.logService.addLog('info', 'Request received', requestInfo);
            await next();
        };
        this.errorHandler = async (ctx, next) => {
            try {
                await next();
            }
            catch (error) {
                console.error('❌ 请求处理错误:', error);
                this.logService.addLog('error', 'Request processing error', {
                    error: error instanceof Error ? error.message : 'Unknown error',
                    stack: error instanceof Error ? error.stack : undefined,
                    url: ctx.url,
                    method: ctx.method,
                    timestamp: new Date().toISOString()
                });
                ctx.status = 500;
                ctx.body = {
                    error: 'Internal server error',
                    timestamp: new Date().toISOString()
                };
            }
        };
        this.authService = new AuthService_1.AuthService();
        this.logService = new LogService_1.LogService();
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=authMiddleware.js.map