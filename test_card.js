const http = require('http');

// 飞书卡片消息测试
async function testCardMessage() {
  console.log('🧪 开始测试卡片消息推送...');
  
  // 卡片消息的 JSON 内容
  const cardContent = {
    "config": {
      "wide_screen_mode": true
    },
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "测试卡片消息"
      },
      "template": "blue"
    },
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "lark_md",
          "content": "这是一个测试卡片消息，包含多种元素类型。"
        }
      },
      {
        "tag": "action",
        "actions": [
          {
            "tag": "button",
            "text": {
              "tag": "plain_text",
              "content": "确认"
            },
            "type": "primary"
          },
          {
            "tag": "button",
            "text": {
              "tag": "plain_text",
              "content": "取消"
            },
            "type": "default"
          }
        ]
      }
    ]
  };

  // 测试本地卡片消息发送
  try {
    console.log('1. 测试本地卡片消息发送...');
    
    const postData = JSON.stringify({
      receive_id: 'c5bf39fa',
      receive_id_type: 'user_id',
      content: JSON.stringify(cardContent),
      msg_type: 'interactive'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 本地卡片消息发送结果:', result);
        } catch (error) {
          console.log('❌ 解析响应失败:', data);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ 本地卡片消息发送失败:', error.message);
    });

    req.write(postData);
    req.end();

  } catch (error) {
    console.error('❌ 本地卡片消息发送异常:', error.message);
  }

  // 测试使用模板 ID 的卡片消息
  try {
    console.log('\n2. 测试使用模板 ID 的卡片消息...');
    
    const templateData = JSON.stringify({
      receive_id: 'c5bf39fa',
      receive_id_type: 'user_id',
      template_id: 'AAqz8kPkIWinz',
      template_variable: {
        "title": "模板卡片测试",
        "content": "这是通过模板 ID 发送的卡片消息",
        "button_text": "点击查看"
      }
    });

    const templateOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(templateData)
      }
    };

    const templateReq = http.request(templateOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 模板卡片消息发送结果:', result);
        } catch (error) {
          console.log('❌ 解析模板响应失败:', data);
        }
      });
    });

    templateReq.on('error', (error) => {
      console.error('❌ 模板卡片消息发送失败:', error.message);
    });

    templateReq.write(templateData);
    templateReq.end();

  } catch (error) {
    console.error('❌ 模板卡片消息发送异常:', error.message);
  }

  // 测试更复杂的卡片内容
  try {
    console.log('\n3. 测试复杂卡片内容...');
    
    const complexCardContent = {
      "config": {
        "wide_screen_mode": true
      },
      "header": {
        "title": {
          "tag": "plain_text",
          "content": "复杂卡片示例"
        },
        "subtitle": {
          "tag": "plain_text",
          "content": "包含多种元素的卡片"
        },
        "template": "green"
      },
      "elements": [
        {
          "tag": "div",
          "text": {
            "tag": "lark_md",
            "content": "**这是一个复杂卡片**\n包含多种元素类型：\n• 文本内容\n• 按钮操作\n• 图片展示"
          }
        },
        {
          "tag": "hr"
        },
        {
          "tag": "div",
          "fields": [
            {
              "is_short": true,
              "text": {
                "tag": "lark_md",
                "content": "**字段1**\n内容描述"
              }
            },
            {
              "is_short": true,
              "text": {
                "tag": "lark_md",
                "content": "**字段2**\n内容描述"
              }
            }
          ]
        },
        {
          "tag": "action",
          "actions": [
            {
              "tag": "button",
              "text": {
                "tag": "plain_text",
                "content": "主要操作"
              },
              "type": "primary",
              "value": {
                "key": "value"
              }
            },
            {
              "tag": "button",
              "text": {
                "tag": "plain_text",
                "content": "次要操作"
              },
              "type": "default"
            }
          ]
        }
      ]
    };

    const complexData = JSON.stringify({
      receive_id: 'c5bf39fa',
      receive_id_type: 'user_id',
      content: JSON.stringify(complexCardContent),
      msg_type: 'interactive'
    });

    const complexOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(complexData)
      }
    };

    const complexReq = http.request(complexOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ 复杂卡片消息发送结果:', result);
        } catch (error) {
          console.log('❌ 解析复杂卡片响应失败:', data);
        }
      });
    });

    complexReq.on('error', (error) => {
      console.error('❌ 复杂卡片消息发送失败:', error.message);
    });

    complexReq.write(complexData);
    complexReq.end();

  } catch (error) {
    console.error('❌ 复杂卡片消息发送异常:', error.message);
  }

  console.log('\n🎉 卡片消息测试完成！');
}

// 运行测试
testCardMessage(); 