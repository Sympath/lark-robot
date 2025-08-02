"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutes = createRoutes;
const express_1 = require("express");
const WebhookController_1 = require("../controllers/WebhookController");
const MessageController_1 = require("../controllers/MessageController");
const HealthController_1 = require("../controllers/HealthController");
const LogController_1 = require("../controllers/LogController");
const LarkService_1 = require("../services/LarkService");
const LogService_1 = require("../services/LogService");
function createRoutes() {
    const router = (0, express_1.Router)();
    const larkService = new LarkService_1.LarkService();
    const logService = new LogService_1.LogService();
    const webhookController = new WebhookController_1.WebhookController(logService);
    const messageController = new MessageController_1.MessageController(larkService, logService);
    const healthController = new HealthController_1.HealthController(larkService, logService);
    const logController = new LogController_1.LogController(logService);
    router.post('/api/callback', (req, res) => webhookController.handleCallback(req, res));
    router.get('/api/callback', (req, res) => webhookController.getCallbackInfo(req, res));
    router.put('/api/message', (req, res) => messageController.sendDefaultMessage(req, res));
    router.post('/api/message', (req, res) => messageController.sendCustomMessage(req, res));
    router.get('/api/message/test-direct', (req, res) => messageController.testSDKDirect(req, res));
    router.get('/api/message', (req, res) => messageController.getMessageInfo(req, res));
    router.get('/api/health', (req, res) => healthController.getHealthStatus(req, res));
    router.get('/api/logs', (req, res) => logController.getLogs(req, res));
    router.post('/api/logs', (req, res) => logController.createLog(req, res));
    return router;
}
//# sourceMappingURL=index.js.map