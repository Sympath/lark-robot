"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
class MessageController {
    constructor(larkService, logService) {
        this.larkService = larkService;
        this.logService = logService;
    }
    async sendDefaultMessage(_req, res) {
        try {
            const lark = require('@larksuiteoapi/node-sdk');
            const client = new lark.Client({
                appId: 'cli_a8079e4490b81013',
                appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
            });
            console.log('🔍 直接 SDK 测试:');
            console.log('- client 类型:', typeof client);
            console.log('- client.im 类型:', typeof client.im);
            console.log('- client.im.message 类型:', typeof client.im.message);
            console.log('- client.im.message.create 类型:', typeof client.im.message.create);
            const result = await client.im.message.create({
                params: {
                    receive_id_type: 'user_id',
                },
                data: {
                    receive_id: 'c5bf39fa',
                    content: JSON.stringify({ text: 'hello world' }),
                    msg_type: 'text',
                },
            });
            console.log('✅ 直接 SDK 调用成功:', result);
            this.logService.addLog('info', 'Direct SDK message sent successfully', result);
            res.json({
                success: true,
                message: 'Direct SDK message sent successfully',
                data: result
            });
        }
        catch (error) {
            this.logService.addLog('error', 'Error sending direct SDK message', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({
                success: false,
                error: 'Failed to send message',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async sendCustomMessage(req, res) {
        try {
            const { receive_id, template_id, template_variable, receive_id_type = 'user_id', content, msg_type = 'text', type } = req.body;
            const actualMsgType = type === 'card' ? 'interactive' : msg_type;
            if (actualMsgType === 'interactive') {
                const lark = require('@larksuiteoapi/node-sdk');
                const client = new lark.Client({
                    appId: 'cli_a8079e4490b81013',
                    appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
                });
                const cardContent = {
                    config: {
                        wide_screen_mode: true
                    },
                    header: {
                        title: {
                            tag: "plain_text",
                            content: content?.title || "测试卡片"
                        }
                    },
                    elements: content?.elements || [
                        {
                            tag: "div",
                            text: {
                                tag: "plain_text",
                                content: "这是一个测试卡片"
                            }
                        },
                        {
                            tag: "action",
                            actions: [
                                {
                                    tag: "button",
                                    text: {
                                        tag: "plain_text",
                                        content: "点击测试"
                                    },
                                    type: "default",
                                    value: {
                                        key: "test"
                                    }
                                }
                            ]
                        }
                    ]
                };
                console.log('🔍 发送卡片消息:', JSON.stringify(cardContent, null, 2));
                const result = await client.im.message.create({
                    params: {
                        receive_id_type: receive_id_type,
                    },
                    data: {
                        receive_id: receive_id || 'c5bf39fa',
                        content: JSON.stringify(cardContent),
                        msg_type: 'interactive',
                    },
                });
                this.logService.addLog('info', 'Interactive message sent successfully', result);
                res.json({
                    success: true,
                    message: 'Interactive message sent successfully',
                    data: result
                });
                return;
            }
            if (template_id) {
                const messageRequest = {
                    receive_id,
                    template_id,
                    template_variable: template_variable || {},
                    receive_id_type
                };
                const response = await this.larkService.sendCardMessage(messageRequest);
                this.logService.addLog('info', 'Custom message sent successfully', response);
                res.json({
                    success: true,
                    message: 'Custom message sent successfully',
                    data: response
                });
                return;
            }
            const messageRequest = {
                receive_id: receive_id || 'c5bf39fa',
                content: JSON.stringify({ text: content || 'default message' }),
                msg_type: actualMsgType,
                receive_id_type
            };
            const response = await this.larkService.sendMessage(messageRequest);
            this.logService.addLog('info', 'Custom message sent successfully', response);
            res.json({
                success: true,
                message: 'Custom message sent successfully',
                data: response
            });
        }
        catch (error) {
            console.error('发送消息失败:', error);
            this.logService.addLog('error', 'Error sending custom message', error instanceof Error ? error.message : 'Unknown error');
            res.status(500).json({
                success: false,
                error: 'Failed to send custom message',
                details: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    async testSDKDirect(_req, res) {
        try {
            const lark = require('@larksuiteoapi/node-sdk');
            const client = new lark.Client({
                appId: 'cli_a8079e4490b81013',
                appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
            });
            console.log('🔍 直接 SDK 测试:');
            console.log('- client 类型:', typeof client);
            console.log('- client.im 类型:', typeof client.im);
            console.log('- client.im.message 类型:', typeof client.im.message);
            console.log('- client.im.message.create 类型:', typeof client.im.message.create);
            const result = await client.im.message.create({
                params: {
                    receive_id_type: 'user_id',
                },
                data: {
                    receive_id: 'c5bf39fa',
                    content: JSON.stringify({ text: 'test from direct SDK' }),
                    msg_type: 'text',
                },
            });
            res.json({
                success: true,
                message: 'Direct SDK test successful',
                data: result
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined
            });
        }
    }
    getMessageInfo(_req, res) {
        res.json({
            message: 'Message API endpoint is ready',
            endpoints: {
                'PUT /api/message': 'Send default test message',
                'POST /api/message': 'Send custom message with body parameters',
                'GET /api/message/test': 'Test SDK directly'
            },
            example: {
                method: 'POST',
                body: {
                    receive_id: 'user_id',
                    template_id: 'template_id',
                    template_variable: {},
                    receive_id_type: 'user_id'
                }
            },
            defaultParams: {
                receive_id: 'g4184fg9',
                template_id: 'ctp_AAzwhCwCTRyT',
                template_variable: {},
                receive_id_type: 'user_id'
            }
        });
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=MessageController.js.map