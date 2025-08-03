import React from 'react';
interface ClientScriptProps {
    onHealthCheck: () => Promise<void>;
    onSendMessage: () => Promise<void>;
    onSendCard: () => Promise<void>;
    onGetLogs: () => Promise<void>;
}
declare const ClientScript: React.FC<ClientScriptProps>;
export default ClientScript;
//# sourceMappingURL=ClientScript.d.ts.map