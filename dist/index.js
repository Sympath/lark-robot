"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = __importDefault(require("./config"));
async function testSDKOnStartup() {
    try {
        console.log('🧪 启动时测试 SDK...');
        const lark = require('@larksuiteoapi/node-sdk');
        const client = new lark.Client({
            appId: config_1.default.appId,
            appSecret: config_1.default.appSecret,
        });
        console.log('SDK Client 类型:', typeof client);
        console.log('SDK Client.im 类型:', typeof client.im);
        console.log('SDK Client.im.message 类型:', typeof client.im.message);
        console.log('SDK Client.im.message.create 类型:', typeof client.im.message.create);
        if (typeof client.im.message.create === 'function') {
            console.log('✅ SDK 初始化成功，create 方法可用');
            const result = await client.im.message.create({
                params: {
                    receive_id_type: 'user_id',
                },
                data: {
                    receive_id: 'c5bf39fa',
                    content: JSON.stringify({ text: 'startup test' }),
                    msg_type: 'text',
                },
            });
            console.log('✅ 启动时 SDK 调用成功:', result);
        }
        else {
            console.log('❌ SDK 初始化失败，create 方法不可用');
            console.log('client.im.message 的所有属性:', Object.keys(client.im.message));
        }
    }
    catch (error) {
        console.error('❌ SDK 测试失败:', error);
    }
}
const app = new app_1.App();
const server = app.getApp().listen(config_1.default.port, () => {
    console.log(`[${new Date().toISOString()}] INFO: Server started on port ${config_1.default.port}`);
    console.log('🚀 Feishu Webhook Server is running on port', config_1.default.port);
    console.log('📱 Webhook URL:', `http://${config_1.default.host}:${config_1.default.port}/api/callback`);
    console.log('🏥 Health Check:', `http://${config_1.default.host}:${config_1.default.port}/api/health`);
    console.log('📝 Logs:', `http://${config_1.default.host}:${config_1.default.port}/api/logs`);
    console.log('🔧 SDK Status:', 'Loaded');
    testSDKOnStartup();
});
process.on('SIGTERM', () => {
    console.log(`[${new Date().toISOString()}] INFO: Server shutting down gracefully`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log(`[${new Date().toISOString()}] INFO: Server shutting down gracefully`);
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
//# sourceMappingURL=index.js.map