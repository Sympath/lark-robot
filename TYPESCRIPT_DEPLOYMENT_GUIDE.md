# 飞书Webhook服务器 - TypeScript版本部署指南

## 项目概述

这是一个使用TypeScript开发的飞书Webhook服务器，支持通过Nginx反向代理对外暴露服务。

## 主要特性

- ✅ **TypeScript支持**: 完整的类型定义和编译
- ✅ **Nginx反向代理**: 高性能的负载均衡和反向代理
- ✅ **Docker支持**: 容器化部署
- ✅ **健康检查**: 自动健康监控
- ✅ **优雅关闭**: 支持信号处理和优雅关闭
- ✅ **多环境支持**: 开发、测试、生产环境配置

## 快速开始

### 方式一：本地开发（推荐）

1. **安装依赖**
   ```bash
   npm install
   ```

2. **开发模式启动**
   ```bash
   npm run dev
   ```

3. **构建并启动生产版本**
   ```bash
   npm run build
   npm start
   ```

### 方式二：使用Nginx反向代理

1. **安装Nginx**
   ```bash
   # macOS
   brew install nginx
   
   # Ubuntu/Debian
   sudo apt install nginx
   ```

2. **启动服务（自动配置Nginx）**
   ```bash
   ./start-with-nginx.sh
   ```

3. **停止服务**
   ```bash
   ./stop-with-nginx.sh
   ```

### 方式三：Docker部署

1. **使用Docker Compose（推荐）**
   ```bash
   # 启动所有服务（应用 + Nginx）
   docker-compose up -d
   
   # 查看日志
   docker-compose logs -f
   
   # 停止服务
   docker-compose down
   ```

2. **单独构建Docker镜像**
   ```bash
   # 构建镜像
   npm run docker:build
   
   # 运行容器
   npm run docker:run
   ```

## 服务端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/webhook` | POST | 飞书Webhook回调端点 |
| `/health` | GET | 健康检查端点 |

## 访问地址

### 本地开发
- 应用直接访问: http://localhost:3000
- Webhook地址: http://localhost:3000/webhook
- 健康检查: http://localhost:3000/health

### Nginx反向代理
- 应用访问: http://localhost
- Webhook地址: http://localhost/webhook
- 健康检查: http://localhost/health

### Docker部署
- 应用访问: http://localhost
- Webhook地址: http://localhost/webhook
- 健康检查: http://localhost/health

## 配置说明

### 环境变量

| 变量名 | 默认值 | 描述 |
|--------|--------|------|
| `PORT` | 3000 | 应用监听端口 |
| `NODE_ENV` | development | 运行环境 |

### Nginx配置

Nginx配置文件位于 `nginx.conf`，主要配置：

- **上游服务器**: 127.0.0.1:3000
- **负载均衡**: 支持多后端服务器
- **安全头**: X-Frame-Options, X-XSS-Protection等
- **Gzip压缩**: 自动压缩响应内容
- **静态文件缓存**: 优化静态资源加载

## 开发指南

### 项目结构

```
src/
├── index.ts          # 主应用入口
├── components/       # React组件
├── config/          # 配置文件
├── controllers/     # 控制器
├── middleware/      # 中间件
├── services/        # 服务层
└── types/          # 类型定义
```

### 可用脚本

```bash
# 开发
npm run dev          # 开发模式启动
npm run watch        # 监听模式编译

# 构建
npm run build        # 构建生产版本
npm run clean        # 清理构建文件

# 启动
npm start            # 启动生产版本
npm run start:prod   # 生产环境启动
npm run start:dev    # 开发环境启动

# Docker
npm run docker:build # 构建Docker镜像
npm run docker:run   # 运行Docker容器

# Nginx
npm run nginx:start  # 启动Nginx
npm run nginx:stop   # 停止Nginx
npm run nginx:reload # 重载Nginx配置
```

### TypeScript配置

项目使用严格的TypeScript配置：

- **目标版本**: ES2020
- **模块系统**: CommonJS
- **严格模式**: 启用所有严格检查
- **类型检查**: 启用所有类型检查选项

## 部署到生产环境

### 1. 服务器要求

- Node.js 18+
- Nginx 1.18+
- Docker & Docker Compose（可选）

### 2. 部署步骤

1. **克隆代码**
   ```bash
   git clone <repository-url>
   cd feishu-webhook-server
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **配置Nginx**
   ```bash
   # 复制nginx配置到系统目录
   sudo cp nginx.conf /etc/nginx/nginx.conf
   
   # 测试配置
   sudo nginx -t
   ```

5. **启动服务**
   ```bash
   # 使用脚本启动（推荐）
   ./start-with-nginx.sh
   
   # 或手动启动
   npm start &
   sudo nginx
   ```

### 3. 使用Docker部署

```bash
# 构建并启动
docker-compose up -d

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f app
docker-compose logs -f nginx
```

## 监控和维护

### 健康检查

服务提供健康检查端点，返回服务状态信息：

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### 日志管理

- **应用日志**: 控制台输出
- **Nginx访问日志**: `/var/log/nginx/access.log`
- **Nginx错误日志**: `/var/log/nginx/error.log`

### 性能优化

1. **Nginx配置优化**
   - 启用Gzip压缩
   - 配置静态文件缓存
   - 设置合适的worker进程数

2. **应用优化**
   - 使用PM2进行进程管理
   - 配置集群模式
   - 启用日志轮转

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 查找占用端口的进程
   lsof -i :3000
   lsof -i :80
   
   # 杀死进程
   kill -9 <PID>
   ```

2. **Nginx启动失败**
   ```bash
   # 检查配置语法
   sudo nginx -t
   
   # 查看错误日志
   sudo tail -f /var/log/nginx/error.log
   ```

3. **应用启动失败**
   ```bash
   # 检查Node.js版本
   node --version
   
   # 检查依赖安装
   npm list
   
   # 重新安装依赖
   rm -rf node_modules package-lock.json
   npm install
   ```

### 调试模式

```bash
# 启用调试日志
DEBUG=* npm run dev

# 查看详细错误信息
NODE_ENV=development npm start
```

## 安全考虑

1. **防火墙配置**
   - 只开放必要端口（80, 443）
   - 限制管理端口访问

2. **SSL/TLS配置**
   - 配置HTTPS证书
   - 启用HTTP/2
   - 设置安全头

3. **应用安全**
   - 验证所有输入
   - 使用环境变量存储敏感信息
   - 定期更新依赖

## 更新和维护

### 更新应用

```bash
# 拉取最新代码
git pull origin main

# 重新构建
npm run build

# 重启服务
./stop-with-nginx.sh
./start-with-nginx.sh
```

### 更新Docker镜像

```bash
# 重新构建镜像
docker-compose build

# 重启服务
docker-compose up -d
```

## 支持

如有问题，请查看：

1. 项目文档
2. 日志文件
3. 健康检查端点
4. GitHub Issues

---

**注意**: 请确保在生产环境中使用HTTPS，并配置适当的SSL证书。