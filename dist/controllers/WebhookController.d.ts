import { Request, Response } from 'express';
import { LogService } from '../services/LogService';
export declare class WebhookController {
    private logService;
    private larkService;
    constructor(logService: LogService);
    handleCallback(req: Request, res: Response): Promise<void>;
    getCallbackInfo(req: Request, res: Response): void;
    private autoReplyToMessage;
    private sendWelcomeMessage;
    private handleCardInteraction;
    private sendUserNotification;
}
//# sourceMappingURL=WebhookController.d.ts.map