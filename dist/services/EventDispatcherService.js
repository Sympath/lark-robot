"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDispatcherService = void 0;
const node_sdk_1 = require("@larksuiteoapi/node-sdk");
const auth_1 = __importDefault(require("../config/auth"));
class EventDispatcherService {
    constructor(logService) {
        this.logService = logService;
        this.initializeEventDispatcher();
    }
    initializeEventDispatcher() {
        try {
            this.eventDispatcher = new node_sdk_1.EventDispatcher({
                encryptKey: auth_1.default.encryptKey,
            });
            this.eventDispatcher.register({
                'im.message.receive_v1': this.handleMessageEvent.bind(this),
            });
            this.logService.addLog('info', 'EventDispatcher initialized successfully', {
                encryptKey: auth_1.default.encryptKey ? 'configured' : 'not configured',
                verificationToken: auth_1.default.verificationToken ? 'configured' : 'not configured',
                appSecret: auth_1.default.appSecret ? 'configured' : 'not configured'
            });
            console.log('✅ EventDispatcher 初始化成功');
        }
        catch (error) {
            console.error('❌ EventDispatcher 初始化失败:', error);
            this.logService.addLog('error', 'EventDispatcher initialization failed', error instanceof Error ? error.message : 'Unknown error');
        }
    }
    async handleUrlVerification(data) {
        try {
            console.log('🔍 处理 URL 验证请求:', JSON.stringify(data, null, 2));
            this.logService.addLog('info', 'URL verification request received', {
                challenge: data.challenge,
                token: data.token,
                timestamp: new Date().toISOString()
            });
            if (data.token !== auth_1.default.verificationToken) {
                const error = 'Invalid verification token';
                console.error('❌ URL 验证失败:', error);
                this.logService.addLog('error', 'URL verification failed', { error });
                throw new Error(error);
            }
            console.log('✅ URL 验证成功，challenge:', data.challenge);
            this.logService.addLog('info', 'URL verification successful', {
                challenge: data.challenge,
                timestamp: new Date().toISOString()
            });
            return {
                challenge: data.challenge
            };
        }
        catch (error) {
            console.error('❌ URL 验证处理失败:', error);
            this.logService.addLog('error', 'URL verification processing failed', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }
    async handleMessageEvent(data) {
        try {
            console.log('📝 处理消息事件:', JSON.stringify(data, null, 2));
            this.logService.addLog('info', 'Message event received', {
                messageId: data.message?.message_id,
                chatId: data.message?.chat_id,
                senderId: data.sender?.sender_id,
                timestamp: new Date().toISOString()
            });
            return { success: true };
        }
        catch (error) {
            console.error('❌ 消息事件处理失败:', error);
            this.logService.addLog('error', 'Message event processing failed', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }
    async handleWebhookRequest(ctx) {
        try {
            console.log('🔍 使用 EventDispatcher 处理 webhook 请求');
            const payload = ctx.request.body;
            if (payload.type === 'url_verification') {
                const result = await this.handleUrlVerification(payload);
                ctx.body = result;
                return;
            }
            const eventData = {
                body: payload,
                headers: ctx.headers
            };
            const result = await this.eventDispatcher.invoke(eventData);
            console.log('✅ EventDispatcher 处理完成:', result);
            this.logService.addLog('info', 'EventDispatcher processing completed', { result });
            ctx.body = result;
        }
        catch (error) {
            console.error('❌ EventDispatcher 处理失败:', error);
            this.logService.addLog('error', 'EventDispatcher processing failed', error instanceof Error ? error.message : 'Unknown error');
            ctx.status = 500;
            ctx.body = {
                error: 'EventDispatcher processing failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    getEventDispatcher() {
        return this.eventDispatcher;
    }
    isInitialized() {
        return this.eventDispatcher !== undefined;
    }
}
exports.EventDispatcherService = EventDispatcherService;
//# sourceMappingURL=EventDispatcherService.js.map