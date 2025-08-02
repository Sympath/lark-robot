import { Request, Response } from 'express';
import { HealthStatus } from '../types';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';
import config from '../config';

export class HealthController {
  private larkService: LarkService;
  private logService: LogService;

  constructor(larkService: LarkService, logService: LogService) {
    this.larkService = larkService;
    this.logService = logService;
  }

  public getHealthStatus(_req: Request, res: Response): void {
    try {
      const healthStatus: HealthStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
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
      res.json(healthStatus);
    } catch (error) {
      this.logService.addLog('error', 'Health check failed', error instanceof Error ? error.message : 'Unknown error');
      
      const errorStatus: HealthStatus = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0',
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

      res.status(503).json(errorStatus);
    }
  }
} 