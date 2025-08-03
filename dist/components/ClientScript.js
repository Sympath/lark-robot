"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ClientScript = (_props) => {
    return ((0, jsx_runtime_1.jsx)("script", { dangerouslySetInnerHTML: {
            __html: `
          // 客户端 JavaScript 代码
          async function checkHealth() {
            try {
              const response = await fetch('/api/health');
              const data = await response.json();
              const resultDiv = document.querySelector('#health-result');
              if (resultDiv) {
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              }
            } catch (error) {
              const resultDiv = document.querySelector('#health-result');
              if (resultDiv) {
                resultDiv.innerHTML = '错误: ' + error.message;
              }
            }
          }
          
          async function sendTestMessage() {
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
              const resultDiv = document.querySelector('#message-result');
              if (resultDiv) {
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              }
            } catch (error) {
              const resultDiv = document.querySelector('#message-result');
              if (resultDiv) {
                resultDiv.innerHTML = '错误: ' + error.message;
              }
            }
          }
          
          async function sendTestCard() {
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
                      { tag: 'action', actions: [{ tag: 'button', text: { tag: 'plain_text', content: '点击测试' }, value: { key: 'test' } }] }
                    ]
                  }
                })
              });
              const data = await response.json();
              const resultDiv = document.querySelector('#message-result');
              if (resultDiv) {
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              }
            } catch (error) {
              const resultDiv = document.querySelector('#message-result');
              if (resultDiv) {
                resultDiv.innerHTML = '错误: ' + error.message;
              }
            }
          }
          
          async function getLogs() {
            try {
              const response = await fetch('/api/logs');
              const data = await response.json();
              const resultDiv = document.querySelector('#logs-result');
              if (resultDiv) {
                resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              }
            } catch (error) {
              const resultDiv = document.querySelector('#logs-result');
              if (resultDiv) {
                resultDiv.innerHTML = '错误: ' + error.message;
              }
            }
          }
        `
        } }));
};
exports.default = ClientScript;
//# sourceMappingURL=ClientScript.js.map