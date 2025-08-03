import { Request, Response } from 'express';
import { LogsResponse, LogEntry } from '../types';
import { LogService } from '../services/LogService';

export class LogController {
  private logService: LogService;

  constructor(logService: LogService) {
    this.logService = logService;
  }

  public getLogs(req: Request, res: Response): void {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const level = req.query.level as string || 'all';

      console.log('🔍 获取日志请求:', { page, limit, level });

      const logs = this.logService.getLogs(page, limit, level);
      const total = this.logService.getTotalCount(level);

      console.log('📊 日志统计:', { logsCount: logs.length, total });

      const response: LogsResponse = {
        logs,
        total,
        page,
        limit
      };

      this.logService.addLog('info', `Logs requested: page=${page}, limit=${limit}, level=${level}`);
      res.json(response);
    } catch (error) {
      console.error('❌ 获取日志失败:', error);
      this.logService.addLog('error', 'Error fetching logs', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).json({ 
        error: 'Failed to fetch logs',
        details: error instanceof Error ? error.message : 'Unknown error',
        logs: [],
        total: 0,
        page: 1,
        limit: 50
      });
    }
  }

  public createLog(req: Request, res: Response): void {
    try {
      const { level, message, data } = req.body;

      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: level || 'info',
        message: message || 'Manual log entry',
        data
      };

      this.logService.addLog(logEntry.level, logEntry.message, logEntry.data);

      res.json({ 
        success: true, 
        message: 'Log entry created',
        data: logEntry
      });
    } catch (error) {
      console.error('❌ 创建日志失败:', error);
      this.logService.addLog('error', 'Error creating log entry', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create log entry',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 