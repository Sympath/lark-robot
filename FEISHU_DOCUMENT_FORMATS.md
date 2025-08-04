# 飞书文档支持格式指南

## 1. 消息类型格式

### 1.1 文本消息 (text)
```json
{
  "msg_type": "text",
  "content": {
    "text": "这是纯文本消息"
  }
}
```

### 1.2 富文本消息 (post)
```json
{
  "msg_type": "post",
  "content": {
    "post": {
      "zh_cn": {
        "title": "标题",
        "content": [
          [
            {
              "tag": "text",
              "text": "这是富文本内容"
            }
          ]
        ]
      }
    }
  }
}
```

### 1.3 图片消息 (image)
```json
{
  "msg_type": "image",
  "content": {
    "image_key": "img_xxx"
  }
}
```

### 1.4 文件消息 (file)
```json
{
  "msg_type": "file",
  "content": {
    "file_key": "file_xxx"
  }
}
```

### 1.5 音频消息 (audio)
```json
{
  "msg_type": "audio",
  "content": {
    "file_key": "file_xxx"
  }
}
```

### 1.6 视频消息 (video)
```json
{
  "msg_type": "video",
  "content": {
    "file_key": "file_xxx"
  }
}
```

### 1.7 媒体消息 (media)
```json
{
  "msg_type": "media",
  "content": {
    "file_key": "file_xxx",
    "image_key": "img_xxx",
    "file_name": "文件名",
    "duration": 10
  }
}
```

### 1.8 卡片消息 (interactive)
```json
{
  "msg_type": "interactive",
  "content": {
    "config": {
      "wide_screen_mode": true
    },
    "header": {
      "title": {
        "tag": "plain_text",
        "content": "卡片标题"
      }
    },
    "elements": [
      {
        "tag": "div",
        "text": {
          "tag": "plain_text",
          "content": "卡片内容"
        }
      }
    ]
  }
}
```

## 2. 卡片元素格式

### 2.1 文本元素
```json
{
  "tag": "div",
  "text": {
    "tag": "plain_text",
    "content": "文本内容"
  }
}
```

### 2.2 按钮元素
```json
{
  "tag": "button",
  "text": {
    "tag": "plain_text",
    "content": "按钮文本"
  },
  "type": "default",
  "value": {
    "key": "button_key"
  }
}
```

### 2.3 图片元素
```json
{
  "tag": "img",
  "img_key": "img_xxx",
  "alt": {
    "tag": "plain_text",
    "content": "图片描述"
  }
}
```

### 2.4 输入框元素
```json
{
  "tag": "input",
  "label": {
    "tag": "plain_text",
    "content": "标签"
  },
  "name": "input_name",
  "placeholder": {
    "tag": "plain_text",
    "content": "占位符"
  }
}
```

### 2.5 选择器元素
```json
{
  "tag": "select_static",
  "label": {
    "tag": "plain_text",
    "content": "选择器标签"
  },
  "name": "select_name",
  "options": [
    {
      "text": {
        "tag": "plain_text",
        "content": "选项1"
      },
      "value": "option1"
    }
  ]
}
```

## 3. 富文本格式

### 3.1 基础文本
```json
{
  "tag": "text",
  "text": "普通文本"
}
```

### 3.2 加粗文本
```json
{
  "tag": "text",
  "text": "加粗文本",
  "style": {
    "bold": true
  }
}
```

### 3.3 斜体文本
```json
{
  "tag": "text",
  "text": "斜体文本",
  "style": {
    "italic": true
  }
}
```

### 3.4 删除线文本
```json
{
  "tag": "text",
  "text": "删除线文本",
  "style": {
    "strikethrough": true
  }
}
```

### 3.5 链接文本
```json
{
  "tag": "a",
  "text": "链接文本",
  "href": "https://example.com"
}
```

### 3.6 图片
```json
{
  "tag": "img",
  "image_key": "img_xxx",
  "width": 300,
  "height": 200
}
```

## 4. 卡片布局格式

### 4.1 基础卡片
```json
{
  "config": {
    "wide_screen_mode": true
  },
  "header": {
    "title": {
      "tag": "plain_text",
      "content": "卡片标题"
    }
  },
  "elements": [
    {
      "tag": "div",
      "text": {
        "tag": "plain_text",
        "content": "卡片内容"
      }
    }
  ]
}
```

### 4.2 带按钮的卡片
```json
{
  "config": {
    "wide_screen_mode": true
  },
  "header": {
    "title": {
      "tag": "plain_text",
      "content": "操作卡片"
    }
  },
  "elements": [
    {
      "tag": "div",
      "text": {
        "tag": "plain_text",
        "content": "请选择操作"
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
          "type": "primary",
          "value": {
            "key": "confirm"
          }
        },
        {
          "tag": "button",
          "text": {
            "tag": "plain_text",
            "content": "取消"
          },
          "type": "default",
          "value": {
            "key": "cancel"
          }
        }
      ]
    }
  ]
}
```

### 4.3 表单卡片
```json
{
  "config": {
    "wide_screen_mode": true
  },
  "header": {
    "title": {
      "tag": "plain_text",
      "content": "信息收集"
    }
  },
  "elements": [
    {
      "tag": "input",
      "label": {
        "tag": "plain_text",
        "content": "姓名"
      },
      "name": "name",
      "placeholder": {
        "tag": "plain_text",
        "content": "请输入姓名"
      }
    },
    {
      "tag": "input",
      "label": {
        "tag": "plain_text",
        "content": "邮箱"
      },
      "name": "email",
      "placeholder": {
        "tag": "plain_text",
        "content": "请输入邮箱"
      }
    },
    {
      "tag": "action",
      "actions": [
        {
          "tag": "button",
          "text": {
            "tag": "plain_text",
            "content": "提交"
          },
          "type": "primary",
          "value": {
            "key": "submit"
          }
        }
      ]
    }
  ]
}
```

## 5. 特殊格式

### 5.1 引用格式
```json
{
  "tag": "quote",
  "text": {
    "tag": "text",
    "text": "引用内容"
  }
}
```

### 5.2 代码块
```json
{
  "tag": "code",
  "text": {
    "tag": "text",
    "text": "console.log('Hello World');"
  }
}
```

### 5.3 分割线
```json
{
  "tag": "hr"
}
```

## 6. 使用示例

### 6.1 发送简单文本
```typescript
await client.im.message.create({
  params: { receive_id_type: 'open_id' },
  data: {
    receive_id: openId,
    content: JSON.stringify({ text: "Hello World" }),
    msg_type: 'text',
  },
});
```

### 6.2 发送富文本
```typescript
const postContent = {
  post: {
    zh_cn: {
      title: "通知标题",
      content: [
        [
          {
            tag: "text",
            text: "这是通知内容",
            style: { bold: true }
          }
        ],
        [
          {
            tag: "a",
            text: "点击查看详情",
            href: "https://example.com"
          }
        ]
      ]
    }
  }
};

await client.im.message.create({
  params: { receive_id_type: 'open_id' },
  data: {
    receive_id: openId,
    content: JSON.stringify(postContent),
    msg_type: 'post',
  },
});
```

### 6.3 发送交互卡片
```typescript
const cardContent = {
  config: { wide_screen_mode: true },
  header: {
    title: { tag: "plain_text", content: "任务提醒" }
  },
  elements: [
    {
      tag: "div",
      text: { tag: "plain_text", content: "您有一个新任务需要处理" }
    },
    {
      tag: "action",
      actions: [
        {
          tag: "button",
          text: { tag: "plain_text", content: "查看详情" },
          type: "primary",
          value: { key: "view_details" }
        }
      ]
    }
  ]
};

await client.im.message.create({
  params: { receive_id_type: 'open_id' },
  data: {
    receive_id: openId,
    content: JSON.stringify(cardContent),
    msg_type: 'interactive',
  },
});
```

## 7. 注意事项

1. **消息长度限制**: 文本消息最大 2048 字符
2. **卡片元素限制**: 最多 50 个元素
3. **按钮数量限制**: 最多 4 个按钮
4. **图片格式**: 支持 JPG、PNG、GIF 格式
5. **文件大小**: 图片最大 10MB，文件最大 100MB
6. **编码要求**: 所有文本内容必须使用 UTF-8 编码

## 8. 相关链接

- [飞书开放平台文档](https://open.feishu.cn/document/server-docs/im-v1/message/create)
- [消息卡片格式](https://open.feishu.cn/document/common-capabilities/message-card/message-card-overview)
- [富文本格式](https://open.feishu.cn/document/common-capabilities/message-card/message-card-overview) 