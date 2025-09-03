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
            // 创建 EventDispatcher 实例
            this.eventDispatcher = new node_sdk_1.EventDispatcher({
                encryptKey: auth_1.default.encryptKey,
                verificationToken: auth_1.default.verificationToken
            });
            // 注册事件处理器
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
    /**
     * 处理 URL 验证请求
     */
    async handleUrlVerification(data) {
        try {
            console.log('🔍 处理 URL 验证请求:', JSON.stringify(data, null, 2));
            this.logService.addLog('info', 'URL verification request received', {
                challenge: data.challenge,
                token: data.token,
                timestamp: new Date().toISOString()
            });
            // 验证 token
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
            // 返回 challenge 值
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
    /**
     * 处理消息事件
     */
    async handleMessageEvent(data) {
        try {
            console.log('📝 处理消息事件:', JSON.stringify(data, null, 2));
            this.logService.addLog('info', 'Message event received', {
                messageId: data.message?.message_id,
                chatId: data.message?.chat_id,
                senderId: data.sender?.sender_id,
                timestamp: new Date().toISOString()
            });
            // 这里可以添加自动回复逻辑
            // await this.autoReplyToMessage(data);
            return { success: true };
        }
        catch (error) {
            console.error('❌ 消息事件处理失败:', error);
            this.logService.addLog('error', 'Message event processing failed', error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }
    /**
     * 处理 webhook 请求
     */
    async handleWebhookRequest(ctx) {
        try {
            console.log('🔍 使用 EventDispatcher 处理 webhook 请求');
            const payload = ctx.request.body;
            // 处理 URL 验证请求
            if (payload.type === 'url_verification') {
                const result = await this.handleUrlVerification(payload);
                ctx.status = 200;
                ctx.set('Content-Type', 'application/json');
                ctx.body = result;
                return;
            }
            // 构造 EventDispatcher 需要的数据格式
            const eventData = {
                body: payload,
                headers: ctx.headers
            };
            // 使用 EventDispatcher 处理其他事件
            const result = await this.eventDispatcher.invoke(eventData);
            console.log('✅ EventDispatcher 处理完成:', result);
            this.logService.addLog('info', 'EventDispatcher processing completed', { result });
            // 返回结果
            ctx.status = 200;
            ctx.set('Content-Type', 'application/json');
            ctx.body = result || { success: true };
        }
        catch (error) {
            console.error('❌ EventDispatcher 处理失败:', error);
            this.logService.addLog('error', 'EventDispatcher processing failed', error instanceof Error ? error.message : 'Unknown error');
            // 返回错误响应
            ctx.status = 500;
            ctx.body = {
                error: 'EventDispatcher processing failed',
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * 获取 EventDispatcher 实例
     */
    getEventDispatcher() {
        return this.eventDispatcher;
    }
    /**
     * 检查 EventDispatcher 是否已初始化
     */
    isInitialized() {
        return this.eventDispatcher !== undefined;
    }
}
exports.EventDispatcherService = EventDispatcherService;
//# sourceMappingURL=EventDispatcherService.js.map