const lark = require('@larksuiteoapi/node-sdk');

// 测试不同的卡片格式
async function testCardFormats() {
  const client = new lark.Client({
    appId: 'cli_a8079e4490b81013',
    appSecret: 'GAUZ0MUBTqW2TRMjx2jU3ffcQhcttQSI',
  });

  const chatId = 'oc_e55d91081dddae90bd877294a437ed2e';

  // 测试格式1：简单卡片
  console.log('测试格式1：简单卡片');
  try {
    const cardContent1 = {
      title: "测试卡片消息",
      elements: [
        [
          {
            tag: "text",
            text: "这是一个测试卡片消息，包含多种元素类型。点击按钮测试交互功能。"
          }
        ],
        [
          {
            tag: "button",
            text: "确认",
            type: "primary",
            value: {
              key: "confirm"
            }
          },
          {
            tag: "button",
            text: "取消",
            type: "default",
            value: {
              key: "cancel"
            }
          }
        ]
      ]
    };

    const response1 = await client.im.message.create({
      params: {
        receive_id_type: 'chat_id',
      },
      data: {
        receive_id: chatId,
        content: JSON.stringify(cardContent1),
        msg_type: 'interactive',
      },
    });

    console.log('✅ 格式1成功:', response1);
  } catch (error) {
    console.log('❌ 格式1失败:', error.message);
  }

  // 测试格式2：复杂卡片
  console.log('\n测试格式2：复杂卡片');
  try {
    const cardContent2 = {
      title: "复杂卡片示例\n包含多种元素的卡片",
      elements: [
        [
          {
            tag: "text",
            text: "这是一个复杂卡片"
          },
          {
            tag: "text",
            text: "\n包含多种元素类型：\n• 文本内容\n• 按钮操作\n• 图片展示"
          }
        ],
        [
          {
            tag: "hr"
          }
        ],
        [
          {
            tag: "text",
            text: "字段1"
          },
          {
            tag: "text",
            text: "\n内容描述"
          },
          {
            tag: "text",
            text: "字段2"
          },
          {
            tag: "text",
            text: "\n内容描述"
          }
        ],
        [
          {
            tag: "button",
            text: "主要操作",
            type: "primary",
            value: {
              key: "primary"
            }
          },
          {
            tag: "button",
            text: "次要操作",
            type: "default",
            value: {
              key: "secondary"
            }
          }
        ]
      ]
    };

    const response2 = await client.im.message.create({
      params: {
        receive_id_type: 'chat_id',
      },
      data: {
        receive_id: chatId,
        content: JSON.stringify(cardContent2),
        msg_type: 'interactive',
      },
    });

    console.log('✅ 格式2成功:', response2);
  } catch (error) {
    console.log('❌ 格式2失败:', error.message);
  }

  // 测试格式3：最简卡片
  console.log('\n测试格式3：最简卡片');
  try {
    const cardContent3 = {
      title: "测试卡片消息",
      elements: [
        [
          {
            tag: "text",
            text: "这是一个测试卡片消息，包含多种元素类型。"
          }
        ],
        [
          {
            tag: "button",
            text: "确认",
            type: "primary"
          },
          {
            tag: "button",
            text: "取消",
            type: "default"
          }
        ]
      ]
    };

    const response3 = await client.im.message.create({
      params: {
        receive_id_type: 'chat_id',
      },
      data: {
        receive_id: chatId,
        content: JSON.stringify(cardContent3),
        msg_type: 'interactive',
      },
    });

    console.log('✅ 格式3成功:', response3);
  } catch (error) {
    console.log('❌ 格式3失败:', error.message);
  }
}

testCardFormats().catch(console.error); 