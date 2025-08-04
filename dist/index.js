"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const LarkService_1 = require("./services/LarkService");
const LogService_1 = require("./services/LogService");
const authMiddleware_1 = require("./middleware/authMiddleware");
const HealthController_1 = require("./controllers/HealthController");
const MessageController_1 = require("./controllers/MessageController");
const WebhookController_1 = require("./controllers/WebhookController");
const LogController_1 = require("./controllers/LogController");
const react_1 = __importDefault(require("react"));
const server_1 = __importDefault(require("react-dom/server"));
const TestPageContainer_1 = __importDefault(require("./components/TestPageContainer"));
const VERSION = '1.0.9';
const BUILD_TIME = new Date().toISOString();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const logService = new LogService_1.LogService();
const larkService = new LarkService_1.LarkService();
const authMiddleware = new authMiddleware_1.AuthMiddleware();
const healthController = new HealthController_1.HealthController(larkService, logService);
const messageController = new MessageController_1.MessageController(larkService, logService);
const webhookController = new WebhookController_1.WebhookController(logService);
const logController = new LogController_1.LogController(logService);
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "http:", "https:"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: false,
    frameguard: false,
    hidePoweredBy: true,
    hsts: false,
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: false,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true
}));
app.get('/favicon.ico', (_req, res) => {
    res.status(204).end();
});
app.get('/api/health', (req, res) => healthController.getHealthStatus(req, res));
app.post('/api/message', (req, res) => messageController.sendCustomMessage(req, res));
app.post('/api/webhook', authMiddleware.logRequest.bind(authMiddleware), authMiddleware.validateFeishuWebhook.bind(authMiddleware), (req, res) => webhookController.handleCallback(req, res));
app.post('/api/callback', authMiddleware.logRequest.bind(authMiddleware), authMiddleware.validateFeishuWebhook.bind(authMiddleware), (req, res) => webhookController.handleCallback(req, res));
app.get('/api/logs', (req, res) => logController.getLogs(req, res));
app.get('/case', (_req, res) => {
    try {
        res.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'ETag': `"${VERSION}-${BUILD_TIME}"`
        });
        const html = server_1.default.renderToString(react_1.default.createElement(TestPageContainer_1.default));
        res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
          <meta http-equiv="Pragma" content="no-cache">
          <meta http-equiv="Expires" content="0">
          <title>飞书 Webhook 测试页面</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
            .result { background: #f5f5f5; padding: 10px; border-radius: 3px; margin-top: 10px; }
            pre { white-space: pre-wrap; word-wrap: break-word; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>飞书 Webhook 测试页面</h1>
            ${html}
          </div>
          <script>
            // 强制刷新缓存
            if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
              window.location.reload(true);
            }
            
            // 添加版本号到URL参数强制刷新
            if (!window.location.search.includes('v=')) {
              const separator = window.location.search ? '&' : '?';
              window.location.href = window.location.pathname + window.location.search + separator + 'v=${VERSION}';
            }
          </script>
        </body>
      </html>
    `);
    }
    catch (error) {
        console.error('Error rendering test page:', error);
        res.status(500).send('Error rendering test page');
    }
});
app.get('/', (_req, res) => {
    res.redirect('/case');
});
app.use((err, req, res, next) => {
    authMiddleware.errorHandler(err, req, res, next);
});
app.listen(port, () => {
    console.log('🚀 飞书 Webhook 服务器启动成功');
    console.log('📦 版本信息:', VERSION);
    console.log('⏰ 构建时间:', BUILD_TIME);
    console.log('📍 服务地址:', `http://localhost:${port}`);
    console.log('🧪 测试页面:', `http://localhost:${port}/case`);
    console.log('🔍 健康检查:', `http://localhost:${port}/api/health`);
});
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号，正在关闭服务器...');
    process.exit(0);
});
//# sourceMappingURL=index.js.map