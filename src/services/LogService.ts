import { LogEntry } from '../types';

export class LogService {
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  public addLog(level: LogEntry['level'], message: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
    
    this.logs.unshift(logEntry);
    
    // 保持最多指定数量的日志
    if (this.logs.length > this.maxLogs) {
      this.logs.splice(this.maxLogs);
    }
    
    console.log(`[${logEntry.timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
  }

  public getLogs(page: number = 1, limit: number = 50, level?: string): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level && level !== 'all') {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return filteredLogs.slice(startIndex, endIndex);
  }

  public getTotalCount(level?: string): number {
    if (level && level !== 'all') {
      return this.logs.filter(log => log.level === level).length;
    }
    return this.logs.length;
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public setMaxLogs(max: number): void {
    this.maxLogs = max;
  }
} 