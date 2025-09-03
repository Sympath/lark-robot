import Koa from 'koa';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';
export declare class HealthController {
    private larkService;
    private logService;
    constructor(larkService: LarkService, logService: LogService);
    getHealthStatus(ctx: Koa.Context): void;
}
//# sourceMappingURL=HealthController.d.ts.map