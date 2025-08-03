const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testHealth() {
  try {
    console.log('🔍 测试健康检查...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ 健康检查通过:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 健康检查失败:', error.message);
    return false;
  }
}

async function testTextMessage() {
  try {
    console.log('🔍 测试文本消息发送...');
    const response = await axios.post(`${BASE_URL}/api/message`, {
      type: 'text',
      content: '这是一条测试文本消息 - ' + new Date().toLocaleString()
    });
    console.log('✅ 文本消息发送成功:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 文本消息发送失败:', error.response?.data || error.message);
    return false;
  }
}

async function testCardMessage() {
  try {
    console.log('🔍 测试卡片消息发送...');
    const cardContent = {
      title: '功能测试卡片',
      elements: [
        {
          tag: "div",
          text: {
            tag: "plain_text",
            content: "这是一个功能测试卡片 - " + new Date().toLocaleString()
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
            },
            {
              tag: "button",
              text: {
                tag: "plain_text",
                content: "取消操作"
              },
              type: "default",
              value: {
                key: "cancel"
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
    console.log('✅ 卡片消息发送成功:', response.data);
    return true;
  } catch (error) {
    console.error('❌ 卡片消息发送失败:', error.response?.data || error.message);
    return false;
  }
}

async function testLogs() {
  try {
    console.log('🔍 测试日志获取...');
    const response = await axios.get(`${BASE_URL}/api/logs`);
    console.log('✅ 日志获取成功，日志数量:', response.data.length);
    return true;
  } catch (error) {
    console.error('❌ 日志获取失败:', error.response?.data || error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 开始功能测试...\n');
  
  const tests = [
    { name: '健康检查', fn: testHealth },
    { name: '文本消息', fn: testTextMessage },
    { name: '卡片消息', fn: testCardMessage },
    { name: '日志获取', fn: testLogs }
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
    console.log('\n🎉 所有测试通过！功能修复成功！');
  } else {
    console.log('\n⚠️ 部分测试失败，请检查相关功能。');
  }
}

// 运行测试
runAllTests().catch(console.error); 