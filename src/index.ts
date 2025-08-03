import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { LarkService } from './services/LarkService';
import { LogService } from './services/LogService';
import { HealthController } from './controllers/HealthController';
import { MessageController } from './controllers/MessageController';
import { WebhookController } from './controllers/WebhookController';
import { LogController } from './controllers/LogController';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import TestPageContainer from './components/TestPageContainer';

const app = express();
const port = process.env.PORT || 3000;

// 配置日志服务
const logService = new LogService();
const larkService = new LarkService();

// 初始化控制器
const healthController = new HealthController(larkService, logService);
const messageController = new MessageController(larkService, logService);
const webhookController = new WebhookController(logService);
const logController = new LogController(logService);

// 中间件配置
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS配置 - 允许所有来源
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 安全配置 - 更宽松的策略
app.use(helmet({
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

// 添加favicon路由避免404错误
app.get('/favicon.ico', (_req, res) => {
  res.status(204).end();
});

// API路由
app.get('/api/health', (req, res) => healthController.getHealthStatus(req, res));
app.post('/api/message', (req, res) => messageController.sendCustomMessage(req, res));
app.post('/api/webhook', (req, res) => webhookController.handleCallback(req, res));
app.get('/api/logs', logController.getLogs);

// 测试页面路由
app.get('/case', (_req, res) => {
  try {
    // 添加缓存控制头，防止浏览器缓存
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    const html = ReactDOMServer.renderToString(React.createElement(TestPageContainer));
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
        </body>
      </html>
    `);
  } catch (error) {
    console.error('Error rendering test page:', error);
    res.status(500).send('Error rendering test page');
  }
});

// 根路径重定向到测试页面
app.get('/', (_req, res) => {
  res.redirect('/case');
});

// 错误处理中间件
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 启动服务器
app.listen(port, () => {
  console.log('🚀 飞书 Webhook 服务器启动成功');
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