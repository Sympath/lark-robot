import { EventDispatcher } from '@larksuiteoapi/node-sdk';
import Koa from 'koa';
import { LogService } from './LogService';
export declare class EventDispatcherService {
    private eventDispatcher;
    private logService;
    constructor(logService: LogService);
    private initializeEventDispatcher;
    private handleUrlVerification;
    private handleMessageEvent;
    handleWebhookRequest(ctx: Koa.Context): Promise<void>;
    getEventDispatcher(): EventDispatcher;
    isInitialized(): boolean;
}
//# sourceMappingURL=EventDispatcherService.d.ts.map