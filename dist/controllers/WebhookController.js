"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const LarkService_1 = require("../services/LarkService");
class WebhookController {
    constructor(logService) {
        this.logService = logService;
        this.larkService = new LarkService_1.LarkService();
    }
    async handleCallback(req, res) {
        try {
            const payload = req.body;
            this.logService.addLog('info', 'callback received', payload);
            console.log('callback received', payload);
            if (payload.type === 'url_verification') {
                this.logService.addLog('info', 'URL verification successful');
                res.json({ challenge: payload.challenge });
                return;
            }
            if (payload.type === 'event_callback' && payload.event) {
                const event = payload.event;
                this.logService.addLog('info', `Event received: ${event.type}`, event);
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
                    default:
                        this.logService.addLog('info', `Unknown event type: ${event.type}`, event);
                }
                res.json({ success: true });
                return;
            }
            res.json({ success: true });
        }
        catch (error) {
            this.logService.addLog('error', 'Error processing webhook', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    getCallbackInfo(req, res) {
        console.log('callback received', req.body);
        res.json({
            message: 'Webhook endpoint is ready',
            status: 'active',
            timestamp: new Date().toISOString(),
            ...req.body
        });
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
}
exports.WebhookController = WebhookController;
//# sourceMappingURL=WebhookController.js.map