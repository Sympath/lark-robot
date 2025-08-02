import { LogEntry } from '../types';
export declare class LogService {
    private logs;
    private maxLogs;
    addLog(level: LogEntry['level'], message: string, data?: any): void;
    getLogs(page?: number, limit?: number, level?: string): LogEntry[];
    getTotalCount(level?: string): number;
    clearLogs(): void;
    setMaxLogs(max: number): void;
}
//# sourceMappingURL=LogService.d.ts.map