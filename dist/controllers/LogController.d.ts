import Koa from 'koa';
import { LogService } from '../services/LogService';
export declare class LogController {
    private logService;
    constructor(logService: LogService);
    getLogs(ctx: Koa.Context): void;
    createLog(ctx: Koa.Context): void;
}
//# sourceMappingURL=LogController.d.ts.map