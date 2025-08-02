import config from '../config';

export function generateHomePage(larkService: any): string {
  return `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Feishu Webhook Server</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 40px; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .card { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; backdrop-filter: blur(10px); }
            .endpoint { background: rgba(255,255,255,0.05); padding: 15px; margin: 10px 0; border-radius: 5px; }
            .status { display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #4CAF50; margin-right: 10px; }
            code { background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 3px; }
            .btn { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
            .btn:hover { background: #45a049; }
            .sdk-status { padding: 5px 10px; border-radius: 3px; font-size: 12px; }
            .sdk-ok { background: #4CAF50; }
            .sdk-mock { background: #FF9800; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Feishu Webhook Server</h1>
                <p>飞书集成 Webhook 服务器</p>
                <div class="sdk-status ${larkService && larkService.isSDKLoaded() ? 'sdk-ok' : 'sdk-mock'}">
                    ${larkService && larkService.isSDKLoaded() ? '✅ 飞书 SDK 已加载' : '⚠️ 使用模拟 SDK'}
                </div>
            </div>
            
            <div class="grid">
                <div class="card">
                    <h2>📊 服务状态</h2>
                    <p><span class="status"></span>服务器运行中</p>
                    <p>端口: ${config.port}</p>
                    <p>环境: ${config.environment}</p>
                </div>
                
                <div class="card">
                    <h2>⚙️ 配置信息</h2>
                    <p><strong>App ID:</strong> <code>${config.appId}</code></p>
                    <p><strong>验证令牌:</strong> <code>${config.verificationToken}</code></p>
                </div>
            </div>
            
            <div class="card">
                <h2>🔗 API 端点</h2>
                <div class="endpoint">
                    <h3>Webhook 回调</h3>
                    <code>POST /api/callback</code>
                    <p>接收飞书事件回调</p>
                </div>
                <div class="endpoint">
                    <h3>发送消息</h3>
                    <code>PUT /api/message</code>
                    <p>发送卡片消息到用户</p>
                </div>
                <div class="endpoint">
                    <h3>健康检查</h3>
                    <code>GET /api/health</code>
                    <p>检查服务健康状态</p>
                </div>
                <div class="endpoint">
                    <h3>日志查看</h3>
                    <code>GET /api/logs</code>
                    <p>查看服务日志</p>
                </div>
            </div>
            
            <div class="card">
                <h2>⚡ 快速操作</h2>
                <button class="btn" onclick="testWebhook()">测试 Webhook</button>
                <button class="btn" onclick="sendMessage()">发送测试消息</button>
                <button class="btn" onclick="viewLogs()">查看日志</button>
            </div>
            
            <div class="card">
                <h2>📖 使用说明</h2>
                <p>1. 在飞书开发者后台配置 Webhook URL: <code>http://${config.host}:${config.port}/api/callback</code></p>
                <p>2. 设置验证令牌: <code>${config.verificationToken}</code></p>
                <p>3. 订阅需要的事件类型（如消息、用户等）</p>
                <p>4. 使用管理脚本: <code>npm run start</code></p>
            </div>
        </div>
        
        <script>
            async function testWebhook() {
                try {
                    const response = await fetch('/api/callback', { method: 'GET' });
                    const data = await response.json();
                    alert('Webhook 测试成功: ' + JSON.stringify(data));
                } catch (error) {
                    alert('测试失败: ' + error.message);
                }
            }
            
            async function sendMessage() {
                try {
                    const response = await fetch('/api/message', { method: 'PUT' });
                    const data = await response.json();
                    alert('消息发送成功: ' + JSON.stringify(data));
                } catch (error) {
                    alert('发送失败: ' + error.message);
                }
            }
            
            async function viewLogs() {
                try {
                    const response = await fetch('/api/logs');
                    const data = await response.json();
                    alert('日志查看: ' + JSON.stringify(data, null, 2));
                } catch (error) {
                    alert('查看失败: ' + error.message);
                }
            }
        </script>
    </body>
    </html>
  `;
} 