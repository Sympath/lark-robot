export interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    data?: any;
}
export interface WebhookPayload {
    type?: string;
    challenge?: string;
    token?: string;
    event?: any;
    schema?: string;
    header?: {
        event_id: string;
        token: string;
        create_time: string;
        event_type: string;
        tenant_key: string;
        app_id: string;
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