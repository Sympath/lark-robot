import React from 'react';
import TestPageServer from './TestPageServer';

interface TestPageContainerProps {
  title?: string;
}

const TestPageContainer: React.FC<TestPageContainerProps> = ({ 
  title = '飞书 Webhook 测试页面' 
}) => {
  return (
    <html>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <div id="root">
          <TestPageServer />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // 客户端 JavaScript 代码 - 完全TSX化
              async function checkHealth() {
                try {
                  const response = await fetch('http://' + window.location.host + '/api/health');
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
                  const response = await fetch('http://' + window.location.host + '/api/message', {
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
                  const response = await fetch('http://' + window.location.host + '/api/message', {
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
                  const response = await fetch('http://' + window.location.host + '/api/logs');
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
          }}
        />
      </body>
    </html>
  );
};

export default TestPageContainer; 