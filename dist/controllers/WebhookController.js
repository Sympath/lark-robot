"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const LarkService_1 = require("../services/LarkService");
const AuthService_1 = require("../services/AuthService");
const EventDispatcherService_1 = require("../services/EventDispatcherService");
const lark = __importStar(require("@larksuiteoapi/node-sdk"));
class WebhookController {
    constructor(logService) {
        this.logService = logService;
        this.larkService = new LarkService_1.LarkService();
        this.authService = new AuthService_1.AuthService();
        this.eventDispatcherService = new EventDispatcherService_1.EventDispatcherService(logService);
    }
    async handleUrlVerification(ctx) {
        try {
            const payload = ctx.request.body;
            console.log('🔍 URL 验证请求:', JSON.stringify(payload, null, 2));
            const authResult = this.authService.validateUrlVerification(payload);
            if (!authResult.isValid) {
                console.error('❌ URL 验证失败:', authResult.error);
                this.logService.addLog('error', 'URL verification failed', { error: authResult.error });
                ctx.status = 401;
                ctx.body = { error: authResult.error };
                return;
            }
            console.log('✅ URL 验证成功，challenge:', authResult.payload.challenge);
            this.logService.addLog('info', 'URL verification successful', {
                challenge: authResult.payload.challenge,
                timestamp: new Date().toISOString()
            });
            ctx.set('Content-Type', 'application/json');
            ctx.body = { challenge: authResult.payload.challenge };
        }
        catch (error) {
            console.error('URL 验证失败:', error);
            this.logService.addLog('error', 'URL verification error', error instanceof Error ? error.message : 'Unknown error');
            ctx.status = 500;
            ctx.body = { error: 'Verification failed' };
        }
    }
    async handleCallbackWithEventDispatcher(ctx) {
        try {
            console.log('🔍 使用 EventDispatcher 处理 webhook 请求');
            if (!this.eventDispatcherService.isInitialized()) {
                console.error('❌ EventDispatcher 未初始化');
                ctx.status = 500;
                ctx.body = { error: 'EventDispatcher not initialized' };
                return;
            }
            await this.eventDispatcherService.handleWebhookRequest(ctx);
        }
        catch (error) {
            console.error('❌ EventDispatcher 处理失败:', error);
            this.logService.addLog('error', 'EventDispatcher processing failed', error instanceof Error ? error.message : 'Unknown error');
            ctx.status = 500;
            ctx.body = { error: 'EventDispatcher processing failed' };
        }
    }
    async handleCallback(ctx) {
        try {
            const authResult = this.authService.validateRequest(ctx);
            if (!authResult.isValid) {
                console.error('❌ 请求验证失败:', authResult.error);
                this.logService.addLog('error', 'Request validation failed', { error: authResult.error });
                ctx.status = 401;
                ctx.body = { error: authResult.error };
                return;
            }
            console.log('✅ 请求验证成功');
            this.logService.addLog('info', 'Request validation successful');
            const payload = authResult.payload || ctx.request.body;
            this.logService.addLog('info', 'callback received', payload);
            console.log('🔍 收到 webhook 请求:', JSON.stringify(payload, null, 2));
            if (payload.type === 'url_verification') {
                this.logService.addLog('info', 'URL verification successful');
                ctx.body = { challenge: payload.challenge };
                return;
            }
            if (payload.schema === '2.0' && payload.event) {
                const event = payload.event;
                console.log('🔍 事件详情:', JSON.stringify(event, null, 2));
                console.log('🔍 事件类型:', event.type);
                console.log('🔍 事件键:', Object.keys(event));
                this.logService.addLog('info', `Event received: ${event.type}`, event);
                try {
                    console.log('🔍 开始处理事件类型:', event.type);
                    switch (event.type) {
                        case 'message':
                            console.log('📝 处理消息事件');
                            this.logService.addLog('info', 'Message event processed', event);
                            await this.autoReplyToMessage(event);
                            break;
                        case 'user_added':
                            console.log('👤 处理用户添加事件');
                            this.logService.addLog('info', 'User added event processed', event);
                            await this.sendWelcomeMessage(event);
                            break;
                        case 'user_removed':
                            console.log('👤 处理用户移除事件');
                            this.logService.addLog('info', 'User removed event processed', event);
                            break;
                        case 'interactive':
                            console.log('🔘 处理交互事件');
                            this.logService.addLog('info', 'Interactive event processed', event);
                            await this.handleCardInteraction(event);
                            break;
                        case 'card.action.trigger':
                            console.log('🔘 处理卡片动作触发事件');
                            this.logService.addLog('info', 'Card action trigger event processed', event);
                            await this.handleCardInteraction(event);
                            break;
                        default:
                            console.log('❓ 未知事件类型:', event.type);
                            this.logService.addLog('info', `Unknown event type: ${event.type}`, event);
                            if (event.action) {
                                console.log('🔍 检测到 action，当作卡片交互处理');
                                await this.handleCardInteraction(event);
                            }
                    }
                    console.log('✅ 事件处理完成，返回成功响应');
                    ctx.body = { success: true };
                    return;
                }
                catch (error) {
                    console.error('❌ 事件处理过程中发生错误:', error);
                    this.logService.addLog('error', 'Event processing failed', error instanceof Error ? error.message : 'Unknown error');
                    ctx.body = { success: true, error: error instanceof Error ? error.message : 'Unknown error' };
                    return;
                }
            }
            if (payload.type === 'event_callback' && payload.event) {
                const event = payload.event;
                this.logService.addLog('info', `Event received (old format): ${event.type}`, event);
                try {
                    switch (event.type) {
                        case 'message':
                            this.logService.addLog('info', 'Message event processed', event);
                            await this.autoReplyToMessage(event);
                            break;
                        case 'user_added':
                            this.logService.addLog('info', 'User added event processed', event);
                            await this.sendWelcomeMessage(event);
                            break;
                        case 'user_removed':
                            this.logService.addLog('info', 'User removed event processed', event);
                            break;
                        case 'interactive':
                            this.logService.addLog('info', 'Interactive event processed', event);
                            await this.handleCardInteraction(event);
                            break;
                        case 'card.action.trigger':
                            this.logService.addLog('info', 'Card action trigger event processed', event);
                            await this.handleCardInteraction(event);
                            break;
                        default:
                            this.logService.addLog('info', `Unknown event type: ${event.type}`, event);
                            if (event.action) {
                                console.log('🔍 检测到 action，当作卡片交互处理');
                                await this.handleCardInteraction(event);
                            }
                    }
                    console.log('✅ 旧格式事件处理完成，返回成功响应');
                    ctx.body = { success: true };
                    return;
                }
                catch (error) {
                    console.error('❌ 旧格式事件处理过程中发生错误:', error);
                    this.logService.addLog('error', 'Old format event processing failed', error instanceof Error ? error.message : 'Unknown error');
                    ctx.body = { success: true, error: error instanceof Error ? error.message : 'Unknown error' };
                    return;
                }
            }
            ctx.status = 400;
            ctx.body = { error: 'Invalid webhook payload' };
        }
        catch (error) {
            console.error('Webhook processing failed:', error);
            ctx.status = 500;
            ctx.body = { error: 'Webhook processing failed' };
        }
    }
    getCallbackInfo(ctx) {
        console.log('callback received', ctx.request.body);
        ctx.body = {
            message: 'Webhook endpoint is ready',
            status: 'active',
            timestamp: new Date().toISOString(),
            ...ctx.request.body
        };
    }
    async autoReplyToMessage(event) {
        try {
            if (event.message && event.message.content) {
                const messageRequest = {
                    receive_id: event.message.chat_id,
                    receive_id_type: 'chat_id',
                    content: JSON.stringify({ text: '收到你的消息了！' }),
                    msg_type: 'text'
                };
                await this.larkService.sendMessage(messageRequest);
                this.logService.addLog('info', 'Auto reply sent successfully');
            }
        }
        catch (error) {
            this.logService.addLog('error', 'Failed to send auto reply', error instanceof Error ? error.message : 'Unknown error');
        }
    }
    async sendWelcomeMessage(event) {
        try {
            if (event.operator_id && event.operator_id.open_id) {
                const messageRequest = {
                    receive_id: event.operator_id.open_id,
                    receive_id_type: 'open_id',
                    content: JSON.stringify({ text: '欢迎加入！我是你的飞书助手。' }),
                    msg_type: 'text'
                };
                await this.larkService.sendMessage(messageRequest);
                this.logService.addLog('info', 'Welcome message sent successfully');
            }
        }
        catch (error) {
            this.logService.addLog('error', 'Failed to send welcome message', error instanceof Error ? error.message : 'Unknown error');
        }
    }
    async handleCardInteraction(event) {
        try {
            console.log('🔘 卡片交互事件:', JSON.stringify(event, null, 2));
            let buttonValue = null;
            let userId = null;
            let chatId = null;
            if (event.action && event.action.value) {
                buttonValue = event.action.value;
                userId = event.user_id || event.open_id || event.operator?.user_id;
                chatId = event.chat_id || event.context?.open_chat_id;
            }
            else if (event.interactive && event.interactive.action) {
                buttonValue = event.interactive.action.value;
                userId = event.user_id || event.open_id || event.operator?.user_id;
                chatId = event.chat_id || event.context?.open_chat_id;
            }
            else if (event.message && event.message.interactive) {
                buttonValue = event.message.interactive.action.value;
                userId = event.user_id || event.open_id || event.operator?.user_id;
                chatId = event.message.chat_id || event.context?.open_chat_id;
            }
            if (buttonValue) {
                const logData = {
                    timestamp: new Date().toISOString(),
                    buttonValue,
                    userId,
                    chatId,
                    action: event.action || event.interactive?.action || event.message?.interactive?.action,
                    eventType: 'card_interaction'
                };
                this.logService.addLog('info', 'Card button clicked', logData);
                const fs = require('fs');
                const logEntry = `${new Date().toISOString()} - 卡片按钮点击: ${JSON.stringify(logData, null, 2)}\n`;
                fs.appendFileSync('card_interactions.log', logEntry);
                console.log('📝 日志已写入文件: card_interactions.log');
                let replyMessage = '';
                let toastMessage = '';
                switch (buttonValue.key) {
                    case 'test':
                        replyMessage = '🎯 你点击了测试按钮！';
                        toastMessage = '测试操作成功';
                        break;
                    case 'confirm':
                        replyMessage = '✅ 你点击了确认按钮！';
                        toastMessage = '操作已确认';
                        break;
                    case 'cancel':
                        replyMessage = '❌ 你点击了取消按钮！';
                        toastMessage = '操作已取消';
                        break;
                    case 'primary':
                        replyMessage = '🎯 你点击了主要操作按钮！';
                        toastMessage = '主要操作执行中';
                        break;
                    case 'secondary':
                        replyMessage = '📝 你点击了次要操作按钮！';
                        toastMessage = '次要操作执行中';
                        break;
                    default:
                        replyMessage = `🔘 你点击了按钮，参数: ${JSON.stringify(buttonValue)}`;
                        toastMessage = '按钮点击成功';
                }
                const messageRequest = {
                    receive_id: chatId,
                    receive_id_type: 'chat_id',
                    content: JSON.stringify({ text: replyMessage }),
                    msg_type: 'text'
                };
                await this.larkService.sendMessage(messageRequest);
                await this.sendUserNotification(userId, toastMessage);
                await this.sendToastNotification(userId, toastMessage);
                this.logService.addLog('info', 'Card interaction reply sent', { replyMessage, toastMessage });
            }
            else {
                this.logService.addLog('warn', 'Card interaction without action value', event);
                console.log('⚠️ 未找到按钮值，事件格式:', JSON.stringify(event, null, 2));
            }
        }
        catch (error) {
            this.logService.addLog('error', 'Failed to handle card interaction', error instanceof Error ? error.message : 'Unknown error');
            console.error('❌ 处理卡片交互失败:', error);
        }
    }
    async sendUserNotification(userId, message) {
        try {
            if (!this.larkService.isSDKLoaded()) {
                console.log('⚠️ SDK 未加载，跳过通知发送');
                return;
            }
            const messageRequest = {
                receive_id: userId,
                receive_id_type: 'user_id',
                content: JSON.stringify({ text: `🔔 ${message}` }),
                msg_type: 'text'
            };
            await this.larkService.sendMessage(messageRequest);
            console.log('✅ 用户通知发送成功:', message);
            const fs = require('fs');
            const notificationLog = `${new Date().toISOString()} - 用户通知: ${message} -> 用户: ${userId}\n`;
            fs.appendFileSync('user_notifications.log', notificationLog);
        }
        catch (error) {
            console.error('❌ 发送用户通知失败:', error);
            const fs = require('fs');
            const errorLog = `${new Date().toISOString()} - 用户通知发送失败: ${error instanceof Error ? error.message : 'Unknown error'} -> 用户: ${userId}\n`;
            fs.appendFileSync('notification_errors.log', errorLog);
        }
    }
    async sendToastNotification(userId, message) {
        try {
            if (!this.larkService.isSDKLoaded()) {
                console.log('⚠️ SDK 未加载，跳过toast通知发送');
                return;
            }
            const lark = require('@larksuiteoapi/node-sdk');
            const client = new lark.Client({
                appId: 'cli_a8079e4490b81013',
                appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
            });
            await client.im.message.create({
                params: {
                    receive_id_type: 'user_id',
                },
                data: {
                    receive_id: userId,
                    content: JSON.stringify({
                        text: `🔔 ${message}`,
                        toast: {
                            text: message,
                            type: 'success'
                        }
                    }),
                    msg_type: 'text',
                },
            });
            console.log('✅ Toast通知发送成功:', message);
            const fs = require('fs');
            const toastLog = `${new Date().toISOString()} - Toast 提醒: ${message} -> 用户: ${userId}\n`;
            fs.appendFileSync('toast_notifications.log', toastLog);
        }
        catch (error) {
            console.error('❌ 发送Toast通知失败:', error);
            const fs = require('fs');
            const errorLog = `${new Date().toISOString()} - Toast通知发送失败: ${error instanceof Error ? error.message : 'Unknown error'} -> 用户: ${userId}\n`;
            fs.appendFileSync('toast_errors.log', errorLog);
        }
    }
    getKoaAdapter() {
        const eventDispatcher = this.eventDispatcherService.getEventDispatcher();
        return async (ctx) => {
            try {
                const eventData = {
                    body: ctx.request.body,
                    headers: ctx.headers
                };
                const result = await eventDispatcher.invoke(eventData);
                ctx.body = result;
            }
            catch (error) {
                console.error('❌ EventDispatcher 处理失败:', error);
                ctx.status = 500;
                ctx.body = { error: 'EventDispatcher processing failed' };
            }
        };
    }
    getExpressAdapter() {
        const eventDispatcher = this.eventDispatcherService.getEventDispatcher();
        return lark.adaptExpress(eventDispatcher, {
            autoChallenge: true
        });
    }
}
exports.WebhookController = WebhookController;
//# sourceMappingURL=WebhookController.js.map