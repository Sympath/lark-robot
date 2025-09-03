"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const config_1 = __importDefault(require("../config"));
// 动态获取版本号
const getVersion = () => {
    try {
        const packageJson = require('../../package.json');
        return packageJson.version;
    }
    catch (error) {
        return '1.0.0'; // 默认版本号
    }
};
class HealthController {
    constructor(larkService, logService) {
        this.larkService = larkService;
        this.logService = logService;
    }
    getHealthStatus(ctx) {
        try {
            const healthStatus = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: getVersion(),
                environment: config_1.default.environment,
                services: {
                    webhook: true,
                    message: true,
                    lark_sdk: this.larkService.isSDKLoaded()
                },
                config: {
                    appId: config_1.default.appId,
                    port: config_1.default.port,
                    sdkLoaded: this.larkService.isSDKLoaded()
                }
            };
            this.logService.addLog('info', 'Health check completed');
            ctx.body = healthStatus;
        }
        catch (error) {
            this.logService.addLog('error', 'Health check failed', error instanceof Error ? error.message : 'Unknown error');
            const errorStatus = {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: getVersion(),
                environment: config_1.default.environment,
                services: {
                    webhook: false,
                    message: false,
                    lark_sdk: false
                },
                config: {
                    appId: config_1.default.appId,
                    port: config_1.default.port,
                    sdkLoaded: false
                }
            };
            ctx.status = 503;
            ctx.body = errorStatus;
        }
    }
}
exports.HealthController = HealthController;
//# sourceMappingURL=HealthController.js.map