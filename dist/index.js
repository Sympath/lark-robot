"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const config_1 = __importDefault(require("./config"));
const HealthController_1 = require("./controllers/HealthController");
const WebhookController_1 = require("./controllers/WebhookController");
const MessageController_1 = require("./controllers/MessageController");
const LogController_1 = require("./controllers/LogController");
const LarkService_1 = require("./services/LarkService");
const LogService_1 = require("./services/LogService");
const TestPageContainer_1 = __importDefault(require("./components/TestPageContainer"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
}));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
const larkService = new LarkService_1.LarkService();
const logService = new LogService_1.LogService();
const healthController = new HealthController_1.HealthController(larkService, logService);
const webhookController = new WebhookController_1.WebhookController(logService);
const messageController = new MessageController_1.MessageController(larkService, logService);
const logController = new LogController_1.LogController(logService);
app.get('/api/health', (req, res) => healthController.getHealthStatus(req, res));
app.post('/api/callback', (req, res) => webhookController.handleCallback(req, res));
app.get('/api/callback', (req, res) => webhookController.getCallbackInfo(req, res));
app.post('/api/message', (req, res) => messageController.sendCustomMessage(req, res));
app.get('/api/logs', (req, res) => logController.getLogs(req, res));
app.get('/case', (_req, res) => {
    const html = server_1.default.renderToString(react_1.default.createElement(TestPageContainer_1.default));
    res.send('<!DOCTYPE html>' + html);
});
app.get('/', (_req, res) => {
    res.json({
        message: '飞书 Webhook 服务器运行中',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            webhook: '/api/callback',
            message: '/api/message',
            logs: '/api/logs',
            test: '/case'
        }
    });
});
app.use((err, _req, res, _next) => {
    console.error('服务器错误:', err);
    logService.addLog('error', 'Server error', err.message);
    res.status(500).json({ error: '服务器内部错误' });
});
const PORT = config_1.default.port;
app.listen(PORT, () => {
    console.log(`🚀 飞书 Webhook 服务器启动成功`);
    console.log(`📍 服务地址: http://localhost:${PORT}`);
    console.log(`🧪 测试页面: http://localhost:${PORT}/case`);
    console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
    logService.addLog('info', `Server started on port ${PORT}`);
});
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    logService.addLog('info', 'Server shutting down');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号，正在关闭服务器...');
    logService.addLog('info', 'Server shutting down');
    process.exit(0);
});
//# sourceMappingURL=index.js.map