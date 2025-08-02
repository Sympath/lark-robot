import { Request, Response } from 'express';
import { LogService } from '../services/LogService';
export declare class LogController {
    private logService;
    constructor(logService: LogService);
    getLogs(req: Request, res: Response): void;
    createLog(req: Request, res: Response): void;
}
//# sourceMappingURL=LogController.d.ts.map