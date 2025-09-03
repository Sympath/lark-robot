import { EventDispatcher } from '@larksuiteoapi/node-sdk';
import Koa from 'koa';
import { LogService } from './LogService';
export declare class EventDispatcherService {
    private eventDispatcher;
    private logService;
    constructor(logService: LogService);
    private initializeEventDispatcher;
    /**
     * 处理 URL 验证请求
     */
    private handleUrlVerification;
    /**
     * 处理消息事件
     */
    private handleMessageEvent;
    /**
     * 处理 webhook 请求
     */
    handleWebhookRequest(ctx: Koa.Context): Promise<void>;
    /**
     * 获取 EventDispatcher 实例
     */
    getEventDispatcher(): EventDispatcher;
    /**
     * 检查 EventDispatcher 是否已初始化
     */
    isInitialized(): boolean;
}
//# sourceMappingURL=EventDispatcherService.d.ts.map