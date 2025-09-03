import Koa from 'koa';
export declare class AuthMiddleware {
    private authService;
    private logService;
    constructor();
    validateFeishuWebhook: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
    validateSignature: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
    logRequest: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
    errorHandler: (ctx: Koa.Context, next: Koa.Next) => Promise<void>;
}
//# sourceMappingURL=authMiddleware.d.ts.map