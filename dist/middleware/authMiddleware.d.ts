import { Request, Response, NextFunction } from 'express';
export declare class AuthMiddleware {
    private authService;
    private logService;
    constructor();
    validateFeishuWebhook(req: Request, res: Response, next: NextFunction): void;
    validateSignature(req: Request, res: Response, next: NextFunction): void;
    logRequest(req: Request, _res: Response, next: NextFunction): void;
    errorHandler(error: Error, req: Request, res: Response, _next: NextFunction): void;
}
//# sourceMappingURL=authMiddleware.d.ts.map