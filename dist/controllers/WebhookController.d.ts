import { Request, Response } from 'express';
import { LogService } from '../services/LogService';
export declare class WebhookController {
    private logService;
    private larkService;
    private authService;
    constructor(logService: LogService);
    handleUrlVerification(req: Request, res: Response): Promise<void>;
    handleCallback(req: Request, res: Response): Promise<void>;
    getCallbackInfo(req: Request, res: Response): void;
    private autoReplyToMessage;
    private sendWelcomeMessage;
    private handleCardInteraction;
    private sendUserNotification;
    private sendToastNotification;
}
//# sourceMappingURL=WebhookController.d.ts.map