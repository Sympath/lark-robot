import Koa from 'koa';
import Router from 'koa-router';
import cors from 'koa-cors';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import { LarkService } from './services/LarkService';
import { LogService } from './services/LogService';
import { AuthMiddleware } from './middleware/authMiddleware';
import { HealthController } from './controllers/HealthController';
import { MessageController } from './controllers/MessageController';
import { WebhookController } from './controllers/WebhookController';
import { LogController } from './controllers/LogController';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import TestPageContainer from './components/TestPageContainer';

// 版本信息
const VERSION = '1.0.9';
const BUILD_TIME = new Date().toISOString();

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 3000;

// 配置服务
const logService = new LogService();
const larkService = new LarkService();
const authMiddleware = new AuthMiddleware();

// 初始化控制器
const healthController = new HealthController(larkService, logService);
const messageController = new MessageController(larkService, logService);
const webhookController = new WebhookController(logService);
const logController = new LogController(logService);

// 中间件配置
app.use(logger());
app.use(bodyParser({
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}));

// CORS配置 - 允许所有来源
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  headers: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 安全配置 - 简化版本
app.use(async (ctx, next) => {
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
  await next();
});

// 添加favicon路由避免404错误
router.get('/favicon.ico', (ctx: Koa.Context) => {
  ctx.status = 204;
});

// API路由
router.get('/api/health', (ctx: Koa.Context) => healthController.getHealthStatus(ctx));
router.post('/api/message', (ctx: Koa.Context) => messageController.sendCustomMessage(ctx));

// Webhook 路由 - 使用鉴权中间件
router.post('/api/webhook', 
  authMiddleware.logRequest,
  authMiddleware.validateFeishuWebhook,
  (ctx: Koa.Context) => webhookController.handleCallback(ctx)
);

// 使用 EventDispatcher 的回调端点（推荐使用）
router.post('/api/callback', 
  authMiddleware.logRequest,
  webhookController.getKoaAdapter()
);

// 使用 Koa 适配器的回调端点
router.post('/api/callback/koa', 
  authMiddleware.logRequest,
  webhookController.getKoaAdapter()
);

router.get('/api/logs', (ctx: Koa.Context) => logController.getLogs(ctx));

// 测试页面路由
router.get('/case', (ctx: Koa.Context) => {
  try {
    // 添加缓存控制头，防止浏览器缓存
    ctx.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'ETag': `"${VERSION}-${BUILD_TIME}"`
    });
    
    const html = ReactDOMServer.renderToString(React.createElement(TestPageContainer));
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
  } catch (error) {
    console.error('Error rendering test page:', error);
    ctx.status = 500;
    ctx.body = 'Error rendering test page';
  }
});

// 根路径重定向到测试页面
router.get('/', (ctx: Koa.Context) => {
  ctx.redirect('/case');
});

// 使用路由
app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理中间件
app.use(authMiddleware.errorHandler);

// 启动服务器
app.listen(port, () => {
  console.log('🚀 飞书 Webhook 服务器启动成功');
  console.log('📦 版本信息:', VERSION);
  console.log('⏰ 构建时间:', BUILD_TIME);
  console.log('📍 服务地址:', `http://localhost:${port}`);
  console.log('🧪 测试页面:', `http://localhost:${port}/case`);
  console.log('🔍 健康检查:', `http://localhost:${port}/api/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
}); 