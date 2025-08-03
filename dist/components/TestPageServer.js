"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const TestPageServer = () => {
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
            marginRight: '8px',
            backgroundColor: '#dc3545'
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { style: styles.body, children: (0, jsx_runtime_1.jsxs)("div", { style: styles.container, children: [(0, jsx_runtime_1.jsx)("h1", { style: styles.title, children: "\u98DE\u4E66 Webhook \u6D4B\u8BD5\u9875\u9762" }), (0, jsx_runtime_1.jsxs)("div", { style: {
                        textAlign: 'center',
                        marginBottom: '20px',
                        padding: '10px',
                        backgroundColor: '#e9ecef',
                        borderRadius: '5px',
                        fontSize: '14px',
                        color: '#495057'
                    }, children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u7248\u672C\u4FE1\u606F:" }), " v1.0.6 | ", (0, jsx_runtime_1.jsx)("strong", { children: "\u6784\u5EFA\u65F6\u95F4:" }), " 2025-08-03T02:30:19.288Z"] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.testSection, children: [(0, jsx_runtime_1.jsxs)("h3", { style: styles.sectionTitle, children: [(0, jsx_runtime_1.jsx)("span", { style: styles.statusIndicator }), "\u5065\u5EB7\u68C0\u67E5"] }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                __html: `<button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="checkHealth()">检查服务状态</button>`
                            } }), (0, jsx_runtime_1.jsx)("div", { id: "health-result", style: styles.result })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.testSection, children: [(0, jsx_runtime_1.jsx)("h3", { style: styles.sectionTitle, children: "\u53D1\u9001\u6D4B\u8BD5\u6D88\u606F" }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                __html: `
              <button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="sendTestMessage()">发送文本消息</button>
              <button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="sendTestCard()">发送卡片消息</button>
            `
                            } }), (0, jsx_runtime_1.jsx)("div", { id: "message-result", style: styles.result })] }), (0, jsx_runtime_1.jsxs)("div", { style: styles.testSection, children: [(0, jsx_runtime_1.jsx)("h3", { style: styles.sectionTitle, children: "\u67E5\u770B\u65E5\u5FD7" }), (0, jsx_runtime_1.jsx)("div", { dangerouslySetInnerHTML: {
                                __html: `<button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="getLogs()">获取最新日志</button>`
                            } }), (0, jsx_runtime_1.jsx)("div", { id: "logs-result", style: styles.result })] })] }) }));
};
exports.default = TestPageServer;
//# sourceMappingURL=TestPageServer.js.map