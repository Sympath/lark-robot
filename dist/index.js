"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_cors_1 = __importDefault(require("koa-cors"));
const koa_logger_1 = __importDefault(require("koa-logger"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
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
const app = new koa_1.default();
const router = new koa_router_1.default();
const port = process.env.PORT || 3000;
const logService = new LogService_1.LogService();
const larkService = new LarkService_1.LarkService();
const authMiddleware = new authMiddleware_1.AuthMiddleware();
const healthController = new HealthController_1.HealthController(larkService, logService);
const messageController = new MessageController_1.MessageController(larkService, logService);
const webhookController = new WebhookController_1.WebhookController(logService);
const logController = new LogController_1.LogController(logService);
app.use((0, koa_logger_1.default)());
app.use((0, koa_bodyparser_1.default)({
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
}));
app.use((0, koa_cors_1.default)({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    headers: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(async (ctx, next) => {
    ctx.set('X-Content-Type-Options', 'nosniff');
    ctx.set('X-Frame-Options', 'DENY');
    ctx.set('X-XSS-Protection', '1; mode=block');
    await next();
});
router.get('/favicon.ico', (ctx) => {
    ctx.status = 204;
});
router.get('/api/health', (ctx) => healthController.getHealthStatus(ctx));
router.post('/api/message', (ctx) => messageController.sendCustomMessage(ctx));
router.post('/api/webhook', authMiddleware.logRequest, authMiddleware.validateFeishuWebhook, (ctx) => webhookController.handleCallback(ctx));
router.post('/api/callback', authMiddleware.logRequest, webhookController.getKoaAdapter());
router.post('/api/callback/koa', authMiddleware.logRequest, webhookController.getKoaAdapter());
router.get('/api/logs', (ctx) => logController.getLogs(ctx));
router.get('/case', (ctx) => {
    try {
        ctx.set({
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'ETag': `"${VERSION}-${BUILD_TIME}"`
        });
        const html = server_1.default.renderToString(react_1.default.createElement(TestPageContainer_1.default));
        ctx.body = `
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
    `;
    }
    catch (error) {
        console.error('Error rendering test page:', error);
        ctx.status = 500;
        ctx.body = 'Error rendering test page';
    }
});
router.get('/', (ctx) => {
    ctx.redirect('/case');
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use(authMiddleware.errorHandler);
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