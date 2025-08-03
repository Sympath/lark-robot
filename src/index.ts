import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from './config';
import { HealthController } from './controllers/HealthController';
import { WebhookController } from './controllers/WebhookController';
import { MessageController } from './controllers/MessageController';
import { LogController } from './controllers/LogController';
import { LarkService } from './services/LarkService';
import { LogService } from './services/LogService';
import TestPageContainer from './components/TestPageContainer';

// 创建 Express 应用
const app = express();

// 中间件配置
app.use(helmet({
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
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 初始化服务
const larkService = new LarkService();
const logService = new LogService();

// 初始化控制器
const healthController = new HealthController(larkService, logService);
const webhookController = new WebhookController(logService);
const messageController = new MessageController(larkService, logService);
const logController = new LogController(logService);

// API 路由
app.get('/api/health', (req, res) => healthController.getHealthStatus(req, res));
app.post('/api/callback', (req, res) => webhookController.handleCallback(req, res));
app.get('/api/callback', (req, res) => webhookController.getCallbackInfo(req, res));
app.post('/api/message', (req, res) => messageController.sendCustomMessage(req, res));
app.get('/api/logs', (req, res) => logController.getLogs(req, res));

// TSX 测试页面路由
app.get('/case', (_req, res) => {
  const html = ReactDOMServer.renderToString(React.createElement(TestPageContainer));
  
  res.send('<!DOCTYPE html>' + html);
});

// 根路径
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

// 错误处理中间件
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('服务器错误:', err);
  logService.addLog('error', 'Server error', err.message);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 飞书 Webhook 服务器启动成功`);
  console.log(`📍 服务地址: http://localhost:${PORT}`);
  console.log(`🧪 测试页面: http://localhost:${PORT}/case`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
  logService.addLog('info', `Server started on port ${PORT}`);
});

// 优雅关闭
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