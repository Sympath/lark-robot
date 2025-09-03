import Koa from 'koa';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';
export declare class MessageController {
    private larkService;
    private logService;
    constructor(larkService: LarkService, logService: LogService);
    sendDefaultMessage(ctx: Koa.Context): Promise<void>;
    sendCustomMessage(ctx: Koa.Context): Promise<void>;
    testSDKDirect(ctx: Koa.Context): Promise<void>;
    getMessageInfo(ctx: Koa.Context): void;
}
//# sourceMappingURL=MessageController.d.ts.map