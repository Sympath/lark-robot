import React from 'react';

const TestPageServer: React.FC = () => {
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
      textAlign: 'center' as const,
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

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>飞书 Webhook 测试页面</h1>
        
        <div style={styles.testSection}>
          <h3 style={styles.sectionTitle}>
            <span style={styles.statusIndicator} />
            健康检查
          </h3>
          <div dangerouslySetInnerHTML={{
            __html: `<button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="checkHealth()">检查服务状态</button>`
          }} />
          <div id="health-result" style={styles.result}></div>
        </div>
        
        <div style={styles.testSection}>
          <h3 style={styles.sectionTitle}>发送测试消息</h3>
          <div dangerouslySetInnerHTML={{
            __html: `
              <button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="sendTestMessage()">发送文本消息</button>
              <button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="sendTestCard()">发送卡片消息</button>
            `
          }} />
          <div id="message-result" style={styles.result}></div>
        </div>
        
        <div style={styles.testSection}>
          <h3 style={styles.sectionTitle}>查看日志</h3>
          <div dangerouslySetInnerHTML={{
            __html: `<button style="padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px;" onclick="getLogs()">获取最新日志</button>`
          }} />
          <div id="logs-result" style={styles.result}></div>
        </div>
      </div>
    </div>
  );
};

export default TestPageServer; 