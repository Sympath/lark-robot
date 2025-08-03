"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const TestPage = () => {
    const [healthResult, setHealthResult] = (0, react_1.useState)(null);
    const [messageResult, setMessageResult] = (0, react_1.useState)(null);
    const [logsResult, setLogsResult] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)({});
    const checkHealth = async () => {
        setLoading(prev => ({ ...prev, health: true }));
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            setHealthResult(data);
        }
        catch (error) {
            setHealthResult({
                status: 'error',
                timestamp: new Date().toISOString(),
                uptime: 0,
                version: '1.0.0',
                environment: 'development',
                services: { webhook: false, message: false, lark_sdk: false },
                config: { appId: '', port: 3000, sdkLoaded: false }
            });
        }
        finally {
            setLoading(prev => ({ ...prev, health: false }));
        }
    };
    const sendTestMessage = async () => {
        debugger;
        setLoading(prev => ({ ...prev, message: true }));
        try {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'text',
                    content: '这是一条测试消息 - ' + new Date().toLocaleString()
                })
            });
            const data = await response.json();
            setMessageResult(data);
        }
        catch (error) {
            setMessageResult({
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
        finally {
            setLoading(prev => ({ ...prev, message: false }));
        }
    };
    const sendTestCard = async () => {
        setLoading(prev => ({ ...prev, card: true }));
        try {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'card',
                    content: {
                        header: { title: { tag: 'plain_text', content: '测试卡片' } },
                        elements: [
                            { tag: 'div', text: { tag: 'plain_text', content: '这是一个测试卡片' } },
                            {
                                tag: 'action',
                                actions: [
                                    {
                                        tag: 'button',
                                        text: { tag: 'plain_text', content: '点击测试' },
                                        value: { key: 'test' }
                                    }
                                ]
                            }
                        ]
                    }
                })
            });
            const data = await response.json();
            setMessageResult(data);
        }
        catch (error) {
            setMessageResult({
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            });
        }
        finally {
            setLoading(prev => ({ ...prev, card: false }));
        }
    };
    const getLogs = async () => {
        setLoading(prev => ({ ...prev, logs: true }));
        try {
            const response = await fetch('/api/logs');
            const data = await response.json();
            setLogsResult(data);
        }
        catch (error) {
            setLogsResult([]);
        }
        finally {
            setLoading(prev => ({ ...prev, logs: false }));
        }
    };
    const styles = {
        body: {
            fontFamily: 'Arial, sans-serif',
            margin: '40px',
            backgroundColor: '#f5f5f5'
        },
        container: {
            maxWidth: '800px',
            margin: '0 auto',
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        testSection: {
            margin: '20px 0',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            backgroundColor: '#fafafa'
        },
        button: {
            padding: '10px 20px',
            margin: '5px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '14px'
        },
        buttonHover: {
            background: '#0056b3'
        },
        buttonDisabled: {
            background: '#6c757d',
            cursor: 'not-allowed'
        },
        result: {
            marginTop: '10px',
            padding: '10px',
            background: '#f8f9fa',
            borderRadius: '3px',
            border: '1px solid #dee2e6',
            fontSize: '12px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            maxHeight: '300px',
            overflow: 'auto'
        },
        title: {
            color: '#333',
            textAlign: 'center',
            marginBottom: '30px'
        },
        sectionTitle: {
            color: '#495057',
            marginBottom: '15px'
        },
        statusIndicator: {
            display: 'inline-block',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            marginRight: '8px'
        },
        statusHealthy: {
            backgroundColor: '#28a745'
        },
        statusUnhealthy: {
            backgroundColor: '#dc3545'
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.body, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.container, children: [(0, jsx_runtime_1.jsx)("h1", { style: styles.title, children: "\u98DE\u4E66 Webhook \u6D4B\u8BD5\u9875\u9762" }), (0, jsx_runtime_1.jsxs)("div", { style: styles.testSection, children: [(0, jsx_runtime_1.jsxs)("h3", { style: styles.sectionTitle, children: [(0, jsx_runtime_1.jsx)("span", { style: {
                                        ...styles.statusIndicator,
                                        ...(healthResult?.status === 'healthy' ? styles.statusHealthy : styles.statusUnhealthy)
                                    } }), "\u5065\u5EB7\u68C0\u67E5"] }), (0, jsx_runtime_1.jsx)("button", { style: {
                                ...styles.button,
                                ...(loading.health ? styles.buttonDisabled : {})
                            }, disabled: loading.health, dangerouslySetInnerHTML: {
                                __html: `${loading.health ? '检查中...' : '检查服务状态'}`
                            } }), healthResult && ((0, jsx_runtime_1.jsx)("div", { style: styles.result, children: JSON.stringify(healthResult, null, 2) }))] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.testSection, children: [(0, jsx_runtime_1.jsx)("h3", { style: styles.sectionTitle, children: "\u53D1\u9001\u6D4B\u8BD5\u6D88\u606F" }), (0, jsx_runtime_1.jsx)("button", { style: {
                                ...styles.button,
                                ...(loading.message ? styles.buttonDisabled : {})
                            }, onClick: () => { }, disabled: loading.message, children: loading.message ? '发送中...' : '发送文本消息' }), (0, jsx_runtime_1.jsx)("button", { style: {
                                ...styles.button,
                                ...(loading.card ? styles.buttonDisabled : {})
                            }, onClick: () => { }, disabled: loading.card, children: loading.card ? '发送中...' : '发送卡片消息' }), messageResult && ((0, jsx_runtime_1.jsx)("div", { style: styles.result, children: JSON.stringify(messageResult, null, 2) }))] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.testSection, children: [(0, jsx_runtime_1.jsx)("h3", { style: styles.sectionTitle, children: "\u67E5\u770B\u65E5\u5FD7" }), (0, jsx_runtime_1.jsx)("button", { style: {
                                ...styles.button,
                                ...(loading.logs ? styles.buttonDisabled : {})
                            }, onClick: () => { }, disabled: loading.logs, children: loading.logs ? '获取中...' : '获取最新日志' }), logsResult && ((0, jsx_runtime_1.jsx)("div", { style: styles.result, children: JSON.stringify(logsResult, null, 2) }))] })] }) }));
};
exports.default = TestPage;
//# sourceMappingURL=TestPage.js.map