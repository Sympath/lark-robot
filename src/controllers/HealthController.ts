import Koa from 'koa';
import { HealthStatus } from '../types';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';
import config from '../config';

// 动态获取版本号
const getVersion = (): string => {
  try {
    const packageJson = require('../../package.json');
    return packageJson.version;
  } catch (error) {
    return '1.0.0'; // 默认版本号
  }
};

export class HealthController {
  private larkService: LarkService;
  private logService: LogService;

  constructor(larkService: LarkService, logService: LogService) {
    this.larkService = larkService;
    this.logService = logService;
  }

  public getHealthStatus(ctx: Koa.Context): void {
    try {
      const healthStatus: HealthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: getVersion(),
        environment: config.environment,
        services: {
          webhook: true,
          message: true,
          lark_sdk: this.larkService.isSDKLoaded()
        },
        config: {
          appId: config.appId,
          port: config.port,
          sdkLoaded: this.larkService.isSDKLoaded()
        }
      };

      this.logService.addLog('info', 'Health check completed');
      ctx.body = healthStatus;
    } catch (error) {
      this.logService.addLog('error', 'Health check failed', error instanceof Error ? error.message : 'Unknown error');
      
      const errorStatus: HealthStatus = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: getVersion(),
        environment: config.environment,
        services: {
          webhook: false,
          message: false,
          lark_sdk: false
        },
        config: {
          appId: config.appId,
          port: config.port,
          sdkLoaded: false
        }
      };

      ctx.status = 503;
      ctx.body = errorStatus;
    }
  }
} 