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
              // 检测是否在 LocalTunnel 环境中
              function isLocalTunnel() {
                return window.location.hostname.includes('loca.lt') || 
                       window.location.hostname.includes('localtunnel');
              }
              
              // 获取 LocalTunnel 密码
              function getLocalTunnelPassword() {
                // 这里可以设置您的公网 IP 作为密码
                return '117.147.104.40';
              }
              
              // 处理 LocalTunnel 警告页面
              async function handleLocalTunnelWarning() {
                if (!isLocalTunnel()) return false;
                
                try {
                  // 尝试直接访问 API 端点
                  const response = await fetch('/api/health', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    }
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'healthy') {
                      return false; // 不需要处理警告页面
                    }
                  }
                } catch (error) {
                  console.log('检测到 LocalTunnel 警告页面');
                }
                
                // 显示警告页面处理提示
                const warningDiv = document.createElement('div');
                warningDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #ff6b6b; color: white; padding: 10px; text-align: center; z-index: 9999;';
                warningDiv.innerHTML = \`
                  <strong>LocalTunnel 警告页面检测</strong><br>
                  请在浏览器中访问: <a href="\${window.location.origin}" target="_blank" style="color: white; text-decoration: underline;">\${window.location.origin}</a><br>
                  输入密码: <strong>\${getLocalTunnelPassword()}</strong> 然后点击 Continue<br>
                  或者使用 curl 命令直接测试 API
                \`;
                document.body.appendChild(warningDiv);
                
                return true;
              }
              
              // 客户端 JavaScript 代码 - 完全TSX化
              async function checkHealth() {
                try {
                  // 检查是否需要处理 LocalTunnel 警告
                  if (await handleLocalTunnelWarning()) {
                    const resultDiv = document.querySelector('#health-result');
                    if (resultDiv) {
                      resultDiv.innerHTML = '<div style="color: red;">⚠️ 检测到 LocalTunnel 警告页面，请先处理警告页面</div>';
                    }
                    return;
                  }
                  
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
                  // 检查是否需要处理 LocalTunnel 警告
                  if (await handleLocalTunnelWarning()) {
                    const resultDiv = document.querySelector('#message-result');
                    if (resultDiv) {
                      resultDiv.innerHTML = '<div style="color: red;">⚠️ 检测到 LocalTunnel 警告页面，请先处理警告页面</div>';
                    }
                    return;
                  }
                  
                  const response = await fetch('/api/message', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    },
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
                  // 检查是否需要处理 LocalTunnel 警告
                  if (await handleLocalTunnelWarning()) {
                    const resultDiv = document.querySelector('#message-result');
                    if (resultDiv) {
                      resultDiv.innerHTML = '<div style="color: red;">⚠️ 检测到 LocalTunnel 警告页面，请先处理警告页面</div>';
                    }
                    return;
                  }
                  
                  // 使用正确的卡片格式
                  const cardContent = {
                    title: '测试卡片',
                    elements: [
                      {
                        tag: "div",
                        text: {
                          tag: "plain_text",
                          content: "这是一个测试卡片 - " + new Date().toLocaleString()
                        }
                      },
                      {
                        tag: "action",
                        actions: [
                          {
                            tag: "button",
                            text: {
                              tag: "plain_text",
                              content: "点击测试"
                            },
                            type: "default",
                            value: {
                              key: "test"
                            }
                          },
                          {
                            tag: "button",
                            text: {
                              tag: "plain_text",
                              content: "确认操作"
                            },
                            type: "primary",
                            value: {
                              key: "confirm"
                            }
                          }
                        ]
                      }
                    ]
                  };

                  const response = await fetch('/api/message', {
                    method: 'POST',
                    headers: { 
                      'Content-Type': 'application/json',
                      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    },
                    body: JSON.stringify({
                      type: 'card',
                      content: cardContent
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
                  // 检查是否需要处理 LocalTunnel 警告
                  if (await handleLocalTunnelWarning()) {
                    const resultDiv = document.querySelector('#logs-result');
                    if (resultDiv) {
                      resultDiv.innerHTML = '<div style="color: red;">⚠️ 检测到 LocalTunnel 警告页面，请先处理警告页面</div>';
                    }
                    return;
                  }
                  
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
              
              // 页面加载时检查 LocalTunnel 状态
              window.addEventListener('load', function() {
                if (isLocalTunnel()) {
                  console.log('检测到 LocalTunnel 环境');
                  handleLocalTunnelWarning();
                }
              });
            `
          }}
        />
      </body>
    </html>
  );
};

export default TestPageContainer; 