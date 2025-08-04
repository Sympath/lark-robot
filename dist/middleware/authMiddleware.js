"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const AuthService_1 = require("../services/AuthService");
const LogService_1 = require("../services/LogService");
class AuthMiddleware {
    constructor() {
        this.authService = new AuthService_1.AuthService();
        this.logService = new LogService_1.LogService();
    }
    validateFeishuWebhook(req, res, next) {
        try {
            console.log('🔐 开始验证飞书 Webhook 请求');
            const authResult = this.authService.validateRequest(req);
            if (!authResult.isValid) {
                console.error('❌ Webhook 验证失败:', authResult.error);
                this.logService.addLog('error', 'Webhook validation failed', {
                    error: authResult.error,
                    headers: req.headers,
                    body: req.body
                });
                res.status(401).json({
                    error: authResult.error,
                    timestamp: new Date().toISOString()
                });
                return;
            }
            console.log('✅ Webhook 验证成功');
            this.logService.addLog('info', 'Webhook validation successful', {
                type: req.body.type || req.body.schema,
                timestamp: new Date().toISOString()
            });
            req.authResult = authResult;
            next();
        }
        catch (error) {
            console.error('❌ 鉴权中间件错误:', error);
            this.logService.addLog('error', 'Auth middleware error', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({
                error: 'Authentication service error',
                timestamp: new Date().toISOString()
            });
        }
    }
    validateSignature(req, res, next) {
        try {
            console.log('🔐 开始验证请求签名');
            const authResult = this.authService.validateSignature(req);
            if (!authResult.isValid) {
                console.error('❌ 签名验证失败:', authResult.error);
                this.logService.addLog('error', 'Signature validation failed', {
                    error: authResult.error,
                    headers: req.headers
                });
                res.status(401).json({
                    error: authResult.error,
                    timestamp: new Date().toISOString()
                });
                return;
            }
            console.log('✅ 签名验证成功');
            this.logService.addLog('info', 'Signature validation successful');
            next();
        }
        catch (error) {
            console.error('❌ 签名验证中间件错误:', error);
            this.logService.addLog('error', 'Signature middleware error', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({
                error: 'Signature validation service error',
                timestamp: new Date().toISOString()
            });
        }
    }
    logRequest(req, _res, next) {
        const requestInfo = {
            method: req.method,
            url: req.url,
            headers: {
                'user-agent': req.headers['user-agent'],
                'content-type': req.headers['content-type'],
                'x-lark-request-timestamp': req.headers['x-lark-request-timestamp'],
                'x-lark-request-nonce': req.headers['x-lark-request-nonce'],
                'x-lark-signature': req.headers['x-lark-signature'] ? '***' : undefined
            },
            body: req.body,
            timestamp: new Date().toISOString()
        };
        console.log('📝 收到请求:', JSON.stringify(requestInfo, null, 2));
        this.logService.addLog('info', 'Request received', requestInfo);
        next();
    }
    errorHandler(error, req, res, _next) {
        console.error('❌ 请求处理错误:', error);
        this.logService.addLog('error', 'Request processing error', {
            error: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            timestamp: new Date().toISOString()
        });
        res.status(500).json({
            error: 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
}
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=authMiddleware.js.map