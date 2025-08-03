"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const TestPage_1 = __importDefault(require("./TestPage"));
const ClientScript_1 = __importDefault(require("./ClientScript"));
const HtmlTemplate = ({ title = '飞书 Webhook 测试页面' }) => {
    return ((0, jsx_runtime_1.jsxs)("html", { children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("title", { children: title }), (0, jsx_runtime_1.jsx)("meta", { charSet: "utf-8" }), (0, jsx_runtime_1.jsx)("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" })] }), (0, jsx_runtime_1.jsxs)("body", { children: [(0, jsx_runtime_1.jsx)("div", { id: "root", children: (0, jsx_runtime_1.jsx)(TestPage_1.default, {}) }), (0, jsx_runtime_1.jsx)(ClientScript_1.default, { onHealthCheck: async () => {
                        }, onSendMessage: async () => { }, onSendCard: async () => { }, onGetLogs: async () => { } })] })] }));
};
exports.default = HtmlTemplate;
//# sourceMappingURL=HtmlTemplate.js.map