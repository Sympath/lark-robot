import Koa from 'koa';
import { LogService } from '../services/LogService';
export declare class WebhookController {
    private logService;
    private larkService;
    private authService;
    private eventDispatcherService;
    constructor(logService: LogService);
    handleUrlVerification(ctx: Koa.Context): Promise<void>;
    handleCallbackWithEventDispatcher(ctx: Koa.Context): Promise<void>;
    handleCallback(ctx: Koa.Context): Promise<void>;
    getCallbackInfo(ctx: Koa.Context): void;
    private autoReplyToMessage;
    private sendWelcomeMessage;
    private handleCardInteraction;
    private sendUserNotification;
    private sendToastNotification;
    /**
     * 获取 Koa 适配器
     */
    getKoaAdapter(): (ctx: Koa.Context) => Promise<void>;
    /**
     * 获取 Express 适配器（兼容性保留）
     */
    getExpressAdapter(): (req: any, res: any) => Promise<void>;
}
//# sourceMappingURL=WebhookController.d.ts.map