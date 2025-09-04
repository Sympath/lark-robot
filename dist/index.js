"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const node_sdk_1 = require("@larksuiteoapi/node-sdk");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const koa_router_1 = __importDefault(require("koa-router"));
// 日志工具类
class Logger {
    constructor() {
        this.logDir = path_1.default.join(process.cwd(), 'logs');
        this.logFile = path_1.default.join(this.logDir, 'app.log');
        this.errorFile = path_1.default.join(this.logDir, 'error.log');
        // 确保日志目录存在
        if (!fs_1.default.existsSync(this.logDir)) {
            fs_1.default.mkdirSync(this.logDir, { recursive: true });
        }
    }
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}\n`;
    }
    writeToFile(filePath, message) {
        fs_1.default.appendFileSync(filePath, message);
    }
    info(message) {
        const formattedMessage = this.formatMessage('INFO', message);
        this.writeToFile(this.logFile, formattedMessage);
        console.log(message); // 同时输出到控制台
    }
    error(message) {
        const formattedMessage = this.formatMessage('ERROR', message);
        this.writeToFile(this.errorFile, formattedMessage);
        console.error(message); // 同时输出到控制台
    }
    warn(message) {
        const formattedMessage = this.formatMessage('WARN', message);
        this.writeToFile(this.logFile, formattedMessage);
        console.warn(message); // 同时输出到控制台
    }
    debug(message) {
        const formattedMessage = this.formatMessage('DEBUG', message);
        this.writeToFile(this.logFile, formattedMessage);
        console.log(message); // 同时输出到控制台
    }
}
// 创建日志实例
const logger = new Logger();
// 创建Koa应用
const app = new koa_1.default();
// 创建事件分发器
const eventDispatcher = new node_sdk_1.EventDispatcher({
    encryptKey: 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb',
    verificationToken: 'test_verification_token', // 添加验证令牌
}).register({
    'url_verification': async (data) => {
        logger.info(`处理url_verification事件: ${JSON.stringify(data)}`);
        return { challenge: data.challenge };
    }
});
// 使用 bodyParser，但保留原始 body
app.use((0, koa_bodyparser_1.default)({
    enableTypes: ['json'],
    extendTypes: {
        json: ['application/json', 'text/plain']
    }
}));
// 健康检查端点（优先处理）
app.use(async (ctx, next) => {
    if (ctx.path === '/health') {
        ctx.body = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        };
        return;
    }
    await next();
});
// // 使用飞书SDK的Koa适配器处理webhook
// app.use(adaptKoa('/webhook', eventDispatcher, {
//   autoChallenge: true, // 自动处理challenge验证
// }));
const router = new koa_router_1.default();
router.post('/webhook', (0, node_sdk_1.adaptKoa)('/webhook', eventDispatcher, {
    autoChallenge: true, // 自动处理challenge验证
}));
app.use(router.routes()).use(router.allowedMethods());
// 处理其他路由
app.use(async (ctx, next) => {
    if (ctx.path !== '/health' && ctx.path !== '/webhook') {
        ctx.status = 404;
        ctx.type = 'application/json';
        ctx.body = { error: 'Not Found' };
    }
    await next();
});
// 启动服务器
const PORT = parseInt(process.env.PORT || '3000', 10);
const server = app.listen(PORT, () => {
    logger.info(`🚀 服务器运行在端口 ${PORT}`);
    logger.info(`📡 Webhook地址: http://localhost:${PORT}/webhook`);
    logger.info(`💚 健康检查: http://localhost:${PORT}/health`);
    logger.info(`📝 日志文件: ${path_1.default.join(process.cwd(), 'logs')}`);
});
// 优雅关闭
process.on('SIGTERM', () => {
    logger.info('收到 SIGTERM 信号，正在关闭服务器...');
    server.close(() => {
        logger.info('服务器已关闭');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    logger.info('收到 SIGINT 信号，正在关闭服务器...');
    server.close(() => {
        logger.info('服务器已关闭');
        process.exit(0);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map