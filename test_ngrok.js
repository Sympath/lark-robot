const axios = require('axios');

const BASE_URL = 'https://9383bfb9e624.ngrok-free.app';

async function testNgrokHealth() {
  try {
    console.log('🔍 测试 ngrok 健康检查...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ ngrok 健康检查通过:', response.data);
    return true;
  } catch (error) {
    console.error('❌ ngrok 健康检查失败:', error.message);
    return false;
  }
}

async function testNgrokTextMessage() {
  try {
    console.log('🔍 测试 ngrok 文本消息发送...');
    const response = await axios.post(`${BASE_URL}/api/message`, {
      type: 'text',
      content: '通过 ngrok 发送的测试消息 - ' + new Date().toLocaleString()
    });
    console.log('✅ ngrok 文本消息发送成功:', response.data);
    return true;
  } catch (error) {
    console.error('❌ ngrok 文本消息发送失败:', error.response?.data || error.message);
    return false;
  }
}

async function testNgrokCardMessage() {
  try {
    console.log('🔍 测试 ngrok 卡片消息发送...');
    const cardContent = {
      title: 'Ngrok 测试卡片',
      elements: [
        {
          tag: "div",
          text: {
            tag: "plain_text",
            content: "通过 ngrok 隧道发送的测试卡片 - " + new Date().toLocaleString()
          }
        },
        {
          tag: "action",
          actions: [
            {
              tag: "button",
              text: {
                tag: "plain_text",
                content: "测试按钮"
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

    const response = await axios.post(`${BASE_URL}/api/message`, {
      type: 'card',
      content: cardContent
    });
    console.log('✅ ngrok 卡片消息发送成功:', response.data);
    return true;
  } catch (error) {
    console.error('❌ ngrok 卡片消息发送失败:', error.response?.data || error.message);
    return false;
  }
}

async function testNgrokLogs() {
  try {
    console.log('🔍 测试 ngrok 日志获取...');
    const response = await axios.get(`${BASE_URL}/api/logs`);
    console.log('✅ ngrok 日志获取成功，日志数量:', response.data.logs?.length || 0);
    return true;
  } catch (error) {
    console.error('❌ ngrok 日志获取失败:', error.response?.data || error.message);
    return false;
  }
}

async function testNgrokWebhook() {
  try {
    console.log('🔍 测试 ngrok webhook 端点...');
    const response = await axios.post(`${BASE_URL}/api/webhook`, {
      type: 'url_verification',
      challenge: 'test_challenge'
    });
    console.log('✅ ngrok webhook 端点正常:', response.data);
    return true;
  } catch (error) {
    console.error('❌ ngrok webhook 端点失败:', error.response?.data || error.message);
    return false;
  }
}

async function runNgrokTests() {
  console.log('🚀 开始 ngrok 隧道功能测试...\n');
  
  const tests = [
    { name: '健康检查', fn: testNgrokHealth },
    { name: '文本消息', fn: testNgrokTextMessage },
    { name: '卡片消息', fn: testNgrokCardMessage },
    { name: '日志获取', fn: testNgrokLogs },
    { name: 'Webhook端点', fn: testNgrokWebhook }
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    console.log(`\n📋 测试: ${test.name}`);
    const result = await test.fn();
    if (result) {
      passed++;
    }
    console.log(`结果: ${result ? '✅ 通过' : '❌ 失败'}`);
  }

  console.log(`\n📊 测试总结:`);
  console.log(`总测试数: ${total}`);
  console.log(`通过: ${passed}`);
  console.log(`失败: ${total - passed}`);
  console.log(`成功率: ${((passed / total) * 100).toFixed(1)}%`);

  if (passed === total) {
    console.log('\n🎉 所有 ngrok 测试通过！隧道工作正常！');
    console.log('\n🌐 公网访问地址: https://9383bfb9e624.ngrok-free.app');
    console.log('📝 请将此地址配置到飞书应用的 Webhook URL');
  } else {
    console.log('\n⚠️ 部分 ngrok 测试失败，请检查隧道配置。');
  }
}

// 运行测试
runNgrokTests().catch(console.error); 