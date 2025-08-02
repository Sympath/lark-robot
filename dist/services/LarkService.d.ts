import { MessageRequest } from '../types';
export declare class LarkService {
    private client;
    private initialized;
    constructor();
    private initializeClient;
    isSDKLoaded(): boolean;
    sendMessage(messageRequest: MessageRequest): Promise<any>;
    sendCardMessage(messageRequest: MessageRequest): Promise<any>;
}
//# sourceMappingURL=LarkService.d.ts.map