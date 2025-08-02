export interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    data?: any;
}
export interface WebhookPayload {
    type: 'url_verification' | 'event_callback';
    challenge?: string;
    token?: string;
    event?: {
        type: string;
        [key: string]: any;
    };
}
export interface MessageRequest {
    receive_id: string;
    template_id?: string;
    template_variable?: Record<string, any>;
    receive_id_type?: 'user_id' | 'chat_id' | 'open_id';
    content?: string;
    msg_type?: string;
}
export interface HealthStatus {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    uptime: number;
    version: string;
    environment: string;
    services: {
        webhook: boolean;
        message: boolean;
        lark_sdk: boolean;
    };
    config: {
        appId: string;
        port: number;
        sdkLoaded: boolean;
    };
}
export interface LogsResponse {
    logs: LogEntry[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=index.d.ts.map