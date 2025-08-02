import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createRoutes } from './routes';
import { LarkService } from './services/LarkService';
import { LogService } from './services/LogService';
import { generateHomePage } from './templates/homePage';
import config from './config';

export class App {
  private app: express.Application;
  private larkService: LarkService;
  private logService: LogService;

  constructor() {
    this.app = express();
    this.larkService = new LarkService();
    this.logService = new LogService();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // 安全中间件
    this.app.use(helmet());
    
    // CORS 中间件
    this.app.use(cors());
    
    // 日志中间件
    this.app.use(morgan('combined'));
    
    // JSON 解析中间件
    this.app.use(express.json({ limit: '10mb' }));
    
    // 静态文件中间件
    this.app.use(express.static('public'));
  }

  private setupRoutes(): void {
    // 主页路由
    this.app.get('/', (_req, res) => {
      res.send(generateHomePage(this.larkService));
    });

    // API 路由
    this.app.use(createRoutes());

    // 默认路由
    this.app.post('/', (req, res) => {
      console.log(req.body);
      res.status(200).send('ok');
    });
  }

  public start(): void {
    this.app.listen(config.port, () => {
      this.logService.addLog('info', `Server started on port ${config.port}`);
      console.log(`🚀 Feishu Webhook Server is running on port ${config.port}`);
      console.log(`📱 Webhook URL: http://${config.host}:${config.port}/api/callback`);
      console.log(`🏥 Health Check: http://${config.host}:${config.port}/api/health`);
      console.log(`📝 Logs: http://${config.host}:${config.port}/api/logs`);
      console.log(`🔧 SDK Status: ${this.larkService.isSDKLoaded() ? 'Loaded' : 'Mock Mode'}`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
      this.logService.addLog('info', 'Server shutting down gracefully');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      this.logService.addLog('info', 'Server shutting down gracefully');
      process.exit(0);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
} 