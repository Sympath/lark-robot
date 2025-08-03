# 🚀 飞书Webhook服务器部署指南

## 📋 部署选项

### 选项1: Railway (推荐 - 免费且简单)

1. **注册Railway账户**
   - 访问 https://railway.app
   - 使用GitHub账户登录

2. **连接GitHub仓库**
   ```bash
   # 确保代码已推送到GitHub
   git add .
   git commit -m "准备部署"
   git push origin main
   ```

3. **部署到Railway**
   - 在Railway控制台点击"New Project"
   - 选择"Deploy from GitHub repo"
   - 选择你的仓库
   - Railway会自动检测并部署

4. **配置环境变量**
   - 在Railway项目设置中添加环境变量
   - `NODE_ENV=production`
   - `PORT=3000`

### 选项2: Render (免费且稳定)

1. **注册Render账户**
   - 访问 https://render.com
   - 使用GitHub账户登录

2. **创建Web Service**
   - 点击"New +" → "Web Service"
   - 连接GitHub仓库
   - 配置如下：
     - **Name**: feishu-webhook
     - **Environment**: Node
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `node dist/index.js`
     - **Health Check Path**: `/api/health`

3. **部署**
   - 点击"Create Web Service"
   - Render会自动构建和部署

### 选项3: Vercel (最简单)

1. **安装Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **部署**
   ```bash
   vercel --prod
   ```

3. **配置**
   - 按照提示配置项目
   - Vercel会自动检测并部署

### 选项4: 本地Docker部署

1. **构建镜像**
   ```bash
   docker build -t feishu-webhook .
   ```

2. **运行容器**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **检查状态**
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs -f
   ```

## 🔧 部署前检查

### 1. 构建测试
```bash
npm run build
```

### 2. 本地测试
```bash
npm start
curl http://localhost:3000/api/health
```

### 3. 功能测试
```bash
# 测试文本消息
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -d '{"type":"text","content":"测试消息"}'

# 测试卡片消息
curl -X POST http://localhost:3000/api/message \
  -H "Content-Type: application/json" \
  -d '{"type":"card","content":{"header":{"title":{"tag":"plain_text","content":"测试卡片"}},"elements":[{"tag":"div","text":{"tag":"plain_text","content":"这是一个测试卡片"}}]}}'
```

## 🌐 部署后验证

### 1. 健康检查
```bash
curl https://your-app-url/api/health
```

### 2. 功能测试
- 访问测试页面: `https://your-app-url/case`
- 测试文本消息发送
- 测试卡片消息发送

### 3. 日志检查
- 检查应用日志
- 检查错误日志

## 📊 监控和维护

### 1. 日志监控
```bash
# Railway
railway logs

# Render
render logs

# Vercel
vercel logs

# Docker
docker-compose logs -f
```

### 2. 性能监控
- 监控响应时间
- 监控错误率
- 监控资源使用

### 3. 自动重启
- 配置健康检查
- 配置自动重启策略

## 🔒 安全配置

### 1. 环境变量
- 不要在代码中硬编码敏感信息
- 使用环境变量管理配置

### 2. HTTPS
- 确保使用HTTPS
- 配置SSL证书

### 3. 访问控制
- 配置防火墙规则
- 限制访问IP

## 🚨 故障排除

### 常见问题

1. **构建失败**
   ```bash
   # 检查Node.js版本
   node --version
   
   # 清理缓存
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **启动失败**
   ```bash
   # 检查端口占用
   lsof -i :3000
   
   # 检查日志
   tail -f logs/error.log
   ```

3. **API调用失败**
   ```bash
   # 检查网络连接
   curl -v https://your-app-url/api/health
   
   # 检查CORS配置
   # 检查防火墙设置
   ```

## 📞 支持

如果遇到问题，请检查：
1. 应用日志
2. 网络连接
3. 环境变量配置
4. 依赖版本兼容性

---

**推荐部署顺序：**
1. Railway (最简单)
2. Render (免费且稳定)
3. Vercel (快速部署)
4. 本地Docker (完全控制) 