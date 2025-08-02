import { Request, Response } from 'express';
import { LarkService } from '../services/LarkService';
import { LogService } from '../services/LogService';
export declare class HealthController {
    private larkService;
    private logService;
    constructor(larkService: LarkService, logService: LogService);
    getHealthStatus(_req: Request, res: Response): void;
}
//# sourceMappingURL=HealthController.d.ts.map