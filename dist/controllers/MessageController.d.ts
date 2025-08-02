import { Request, Response } from 'express';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';
export declare class MessageController {
    private larkService;
    private logService;
    constructor(larkService: LarkService, logService: LogService);
    sendDefaultMessage(_req: Request, res: Response): Promise<void>;
    sendCustomMessage(req: Request, res: Response): Promise<void>;
    testSDKDirect(_req: Request, res: Response): Promise<void>;
    getMessageInfo(_req: Request, res: Response): void;
}
//# sourceMappingURL=MessageController.d.ts.map