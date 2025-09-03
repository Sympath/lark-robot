import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { EventDispatcher, adaptKoa } from '@larksuiteoapi/node-sdk';
import { Context, Next } from 'koa';
import fs from 'fs';
import path from 'path';

// 定义事件数据类型
interface UrlVerificationData {
  challenge: string;
}

interface EventData {
  challenge?: string;
  [key: string]: any;
}

// 日志工具类
class Logger {
  private logDir: string;
  private logFile: string;
  private errorFile: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'app.log');
    this.errorFile = path.join(this.logDir, 'error.log');
    
    // 确保日志目录存在
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}\n`;
  }

  private writeToFile(filePath: string, message: string): void {
    fs.appendFileSync(filePath, message);
  }

  info(message: string): void {
    const formattedMessage = this.formatMessage('INFO', message);
    this.writeToFile(this.logFile, formattedMessage);
    console.log(message); // 同时输出到控制台
  }

  error(message: string): void {
    const formattedMessage = this.formatMessage('ERROR', message);
    this.writeToFile(this.errorFile, formattedMessage);
    console.error(message); // 同时输出到控制台
  }

  warn(message: string): void {
    const formattedMessage = this.formatMessage('WARN', message);
    this.writeToFile(this.logFile, formattedMessage);
    console.warn(message); // 同时输出到控制台
  }

  debug(message: string): void {
    const formattedMessage = this.formatMessage('DEBUG', message);
    this.writeToFile(this.logFile, formattedMessage);
    console.log(message); // 同时输出到控制台
  }
}

// 创建日志实例
const logger = new Logger();

// 创建Koa应用
const app = new Koa();

// 创建事件分发器
const eventDispatcher = new EventDispatcher({
  encryptKey: 'qsJboodT6Or4STWCp9DqHfbwWrG5TqPb',
  verificationToken: 'test_verification_token', // 添加验证令牌
}).register({
  'url_verification': async (data: UrlVerificationData) => {
    logger.info(`处理url_verification事件: ${JSON.stringify(data)}`);
    return { challenge: data.challenge };
  }
});

// 使用 bodyParser，但保留原始 body
app.use(bodyParser({
  enableTypes: ['json'],
  extendTypes: {
    json: ['application/json', 'text/plain']
  }
}));

// 健康检查端点（优先处理）
app.use(async (ctx: Context, next: Next) => {
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

// 使用飞书SDK的Koa适配器处理webhook
app.use(adaptKoa('/webhook', eventDispatcher, {
  autoChallenge: true, // 自动处理challenge验证
}));

// 处理其他路由
app.use(async (ctx: Context, next: Next) => {
  if (ctx.path !== '/health' && ctx.path !== '/webhook') {
    ctx.status = 404;
    ctx.type = 'application/json';
    ctx.body = { error: 'Not Found' };
  }
  await next();
});

// 启动服务器
const PORT: number = parseInt(process.env.PORT || '3000', 10);
const server = app.listen(PORT, () => {
  logger.info(`🚀 服务器运行在端口 ${PORT}`);
  logger.info(`📡 Webhook地址: http://localhost:${PORT}/webhook`);
  logger.info(`💚 健康检查: http://localhost:${PORT}/health`);
  logger.info(`📝 日志文件: ${path.join(process.cwd(), 'logs')}`);
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

export default app;