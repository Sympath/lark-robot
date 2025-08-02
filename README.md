# 飞书 Webhook 服务器

一个基于 TypeScript 和 Express.js 的飞书 Webhook 服务器，支持反向代理部署。

## 🚀 特性

- ✅ **TypeScript 支持** - 完整的类型安全
- ✅ **模块化架构** - 清晰的 MVC 结构
- ✅ **反向代理** - Nginx 配置支持
- ✅ **Docker 部署** - 容器化部署
- ✅ **健康检查** - 自动健康监控
- ✅ **日志系统** - 完整的日志记录
- ✅ **安全头** - 内置安全防护
- ✅ **负载均衡** - 支持多实例部署

## 📁 项目结构

```
feishu/
├── src/
│   ├── controllers/     # 控制器层
│   ├── services/        # 服务层
│   ├── types/          # 类型定义
│   ├── routes/         # 路由配置
│   ├── templates/      # 模板文件
│   ├── app.ts          # 应用主文件
│   ├── config.ts       # 配置文件
│   └── index.ts        # 入口文件
├── dist/               # 编译输出
├── logs/               # 日志文件
├── nginx.conf          # Nginx 配置
├── docker-compose.yml  # Docker Compose 配置
├── Dockerfile          # Docker 配置
├── package.json        # 项目配置
├── tsconfig.json       # TypeScript 配置
├── deploy.sh           # 部署脚本
├── manage.sh           # 管理脚本
└── README.md           # 项目文档
```

## 🛠️ 安装和运行

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **开发模式运行**
   ```bash
   npm run dev
   ```

3. **生产模式构建**
   ```bash
   npm run build
   npm start
   ```

### Docker 部署

1. **使用管理脚本**
   ```bash
   chmod +x manage.sh
   ./manage.sh deploy
   ```

2. **手动部署**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **管理服务**
   ```bash
   ./manage.sh start    # 启动服务
   ./manage.sh stop     # 停止服务
   ./manage.sh restart  # 重启服务
   ./manage.sh status   # 查看状态
   ./manage.sh logs     # 查看日志
   ```

## 🔧 配置

### 环境变量

在 `src/config.ts` 中配置：

```typescript
const config: Config = {
  appId: 'your-app-id',
  appSecret: 'your-app-secret',
  verificationToken: 'your-verification-token',
  port: 3000,
  environment: 'production',
  host: 'your-domain.com'
};
```

### 飞书配置

1. 在飞书开发者后台创建应用
2. 配置 Webhook URL: `http://your-domain.com/api/callback`
3. 设置验证令牌
4. 订阅需要的事件类型

## 📡 API 端点

### Webhook 回调
- `POST /api/callback` - 接收飞书事件回调
- `GET /api/callback` - 获取回调端点信息

### 消息发送
- `PUT /api/message` - 发送默认测试消息
- `POST /api/message` - 发送自定义消息
- `GET /api/message` - 获取消息 API 信息

### 健康检查
- `GET /api/health` - 服务健康状态

### 日志管理
- `GET /api/logs` - 获取日志列表
- `POST /api/logs` - 创建日志条目

## 🔒 安全特性

- **Helmet.js** - 安全头设置
- **CORS** - 跨域资源共享
- **输入验证** - 请求数据验证
- **错误处理** - 统一错误处理
- **日志记录** - 完整的操作日志

## 📊 监控和日志

### 健康检查
```bash
curl http://your-domain.com/api/health
```

### 日志查看
```bash
curl http://your-domain.com/api/logs
```

### Docker 日志
```bash
docker-compose logs -f
```

## 🚀 部署架构

```
Internet
    ↓
Nginx (反向代理)
    ↓
Node.js App (飞书 Webhook)
    ↓
Redis (可选缓存)
```

## 🔧 开发

### 代码结构

- **Controllers** - 处理 HTTP 请求和响应
- **Services** - 业务逻辑层
- **Types** - TypeScript 类型定义
- **Routes** - 路由配置
- **Templates** - HTML 模板

### 添加新功能

1. 在 `src/types/` 中添加类型定义
2. 在 `src/services/` 中添加业务逻辑
3. 在 `src/controllers/` 中添加控制器
4. 在 `src/routes/` 中添加路由

## 📝 许可证

ISC License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请查看：
- [飞书开放平台文档](https://open.feishu.cn/)
- [项目 Issues](https://github.com/your-repo/issues) 