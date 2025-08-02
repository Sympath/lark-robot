"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarkService = void 0;
const config_1 = __importDefault(require("../config"));
class LarkService {
    constructor() {
        this.client = null;
        this.initialized = false;
        this.initializeClient();
    }
    async initializeClient() {
        try {
            const lark = require('@larksuiteoapi/node-sdk');
            this.client = new lark.Client({
                appId: config_1.default.appId,
                appSecret: config_1.default.appSecret,
            });
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('✅ 飞书 SDK 加载成功');
            this.initialized = true;
        }
        catch (error) {
            console.log('⚠️ 飞书 SDK 未安装，使用模拟实现');
            this.client = null;
            this.initialized = false;
        }
    }
    isSDKLoaded() {
        return this.client !== null && this.client.im !== undefined && this.initialized;
    }
    async sendMessage(messageRequest) {
        if (!this.initialized) {
            await this.initializeClient();
        }
        if (!this.client) {
            throw new Error('Lark SDK not loaded');
        }
        try {
            if (!this.client.im || !this.client.im.message) {
                throw new Error('Lark SDK not properly initialized');
            }
            console.log('🔍 调试信息:');
            console.log('- client 类型:', typeof this.client);
            console.log('- client.im 类型:', typeof this.client.im);
            console.log('- client.im.message 类型:', typeof this.client.im.message);
            console.log('- client.im.message.create 类型:', typeof this.client.im.message.create);
            console.log('- client.im.message 的所有方法:', Object.keys(this.client.im.message));
            const res = await this.client.im.message.create({
                params: {
                    receive_id_type: messageRequest.receive_id_type || 'user_id',
                },
                data: {
                    receive_id: messageRequest.receive_id,
                    content: messageRequest.content || JSON.stringify({ text: 'hello world' }),
                    msg_type: messageRequest.msg_type || 'text',
                },
            });
            return res;
        }
        catch (error) {
            console.error('发送消息失败:', error);
            throw error;
        }
    }
    async sendCardMessage(messageRequest) {
        if (!this.initialized) {
            await this.initializeClient();
        }
        if (!this.client) {
            throw new Error('Lark SDK not loaded');
        }
        const response = await this.client.im.message.createByCard({
            data: {
                receive_id: messageRequest.receive_id,
                template_id: messageRequest.template_id,
                template_variable: messageRequest.template_variable || {},
            },
            params: {
                receive_id_type: messageRequest.receive_id_type || 'user_id'
            },
        });
        return response;
    }
}
exports.LarkService = LarkService;
//# sourceMappingURL=LarkService.js.map