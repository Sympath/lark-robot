import Koa from 'koa';
export declare class AuthMiddleware {
    private authService;
    private logService;
    constructor();
    /**
     * 验证飞书 Webhook 请求的中间件
     */
    validateFeishuWebhook: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
    /**
     * 验证签名（可选，用于更严格的安全验证）
     */
    validateSignature: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
    /**
     * 记录请求信息的中间件
     */
    logRequest: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
    /**
     * 错误处理中间件
     */
    errorHandler: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
}
//# sourceMappingURL=authMiddleware.d.ts.map