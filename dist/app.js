"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = require("./routes");
const LarkService_1 = require("./services/LarkService");
const LogService_1 = require("./services/LogService");
const homePage_1 = require("./templates/homePage");
const config_1 = __importDefault(require("./config"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.larkService = new LarkService_1.LarkService();
        this.logService = new LogService_1.LogService();
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, cors_1.default)());
        this.app.use((0, morgan_1.default)('combined'));
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.static('public'));
    }
    setupRoutes() {
        this.app.get('/', (_req, res) => {
            res.send((0, homePage_1.generateHomePage)(this.larkService));
        });
        this.app.use((0, routes_1.createRoutes)());
        this.app.post('/', (req, res) => {
            console.log(req.body);
            res.status(200).send('ok');
        });
    }
    start() {
        this.app.listen(config_1.default.port, () => {
            this.logService.addLog('info', `Server started on port ${config_1.default.port}`);
            console.log(`🚀 Feishu Webhook Server is running on port ${config_1.default.port}`);
            console.log(`📱 Webhook URL: http://${config_1.default.host}:${config_1.default.port}/api/callback`);
            console.log(`🏥 Health Check: http://${config_1.default.host}:${config_1.default.port}/api/health`);
            console.log(`📝 Logs: http://${config_1.default.host}:${config_1.default.port}/api/logs`);
            console.log(`🔧 SDK Status: ${this.larkService.isSDKLoaded() ? 'Loaded' : 'Mock Mode'}`);
        });
        process.on('SIGTERM', () => {
            this.logService.addLog('info', 'Server shutting down gracefully');
            process.exit(0);
        });
        process.on('SIGINT', () => {
            this.logService.addLog('info', 'Server shutting down gracefully');
            process.exit(0);
        });
    }
    getApp() {
        return this.app;
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map