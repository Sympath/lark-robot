"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogService = void 0;
class LogService {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
    }
    addLog(level, message, data) {
        const logEntry = {
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
    getLogs(page = 1, limit = 50, level) {
        let filteredLogs = this.logs;
        if (level && level !== 'all') {
            filteredLogs = this.logs.filter(log => log.level === level);
        }
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        return filteredLogs.slice(startIndex, endIndex);
    }
    getTotalCount(level) {
        if (level && level !== 'all') {
            return this.logs.filter(log => log.level === level).length;
        }
        return this.logs.length;
    }
    clearLogs() {
        this.logs = [];
    }
    setMaxLogs(max) {
        this.maxLogs = max;
    }
}
exports.LogService = LogService;
//# sourceMappingURL=LogService.js.map