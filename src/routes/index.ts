import { Router } from 'express';
import { WebhookController } from '../controllers/WebhookController';
import { MessageController } from '../controllers/MessageController';
import { HealthController } from '../controllers/HealthController';
import { LogController } from '../controllers/LogController';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';

export function createRoutes(): Router {
  const router = Router();
  
  // 初始化服务
  const larkService = new LarkService();
  const logService = new LogService();
  
  // 初始化控制器
  const webhookController = new WebhookController(logService);
  const messageController = new MessageController(larkService, logService);
  const healthController = new HealthController(larkService, logService);
  const logController = new LogController(logService);

  // Webhook 路由
  router.post('/api/callback', (req, res) => webhookController.handleCallback(req, res));
  router.get('/api/callback', (req, res) => webhookController.getCallbackInfo(req, res));

  // 消息路由
  router.put('/api/message', (req, res) => messageController.sendDefaultMessage(req, res));
  router.post('/api/message', (req, res) => messageController.sendCustomMessage(req, res));
  router.get('/api/message/test-direct', (req, res) => messageController.testSDKDirect(req, res));
  router.get('/api/message', (req, res) => messageController.getMessageInfo(req, res));

  // 健康检查路由
  router.get('/api/health', (req, res) => healthController.getHealthStatus(req, res));

  // 日志路由
  router.get('/api/logs', (req, res) => logController.getLogs(req, res));
  router.post('/api/logs', (req, res) => logController.createLog(req, res));

  return router;
} 