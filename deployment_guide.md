# 趣图匣子 (Qutu) 宝塔部署指南

本文档介绍如何将迁移后的 uni-app 前端项目和 NestJS 后端项目部署到宝塔面板。

---

## 一、 前端部署 (uni-app H5)

### 1. 本地构建
在项目根目录下执行编译命令：
```bash
npm run build:h5
```
编译完成后，代码会生成在 `dist/build/h5` 目录下。

### 2. 上传与配置
1.  **添加站点**：宝塔面板 -> 网站 -> 添加站点。PHP 版本选择 **“纯静态”**。
2.  **上传文件**：将 `dist/build/h5` 目录下的所有文件上传并解压到站点根目录。
3.  **伪静态设置**：为了支持单页面应用路由，请在站点设置 -> 伪静态中添加：
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```

---

## 二、 后端部署 (NestJS + Prisma)

### 1. 准备工作
将 `backend` 文件夹（**不包含** `node_modules`）压缩并上传到服务器。

### 2. 数据库配置 (MySQL)
1.  宝塔侧添加数据库（例如 `qutu`）。
2.  修改服务器上 `backend/.env` 中的 `DATABASE_URL`：
    ```env
    DATABASE_URL="mysql://用户名:密码@localhost:3306/qutu"
    ```

### 3. 初始化项目
在服务器终端进入 `backend` 目录，执行以下命令：
```bash
npm install --production        # 安装生产环境依赖
npx prisma generate              # 生成 Prisma Client
npx prisma db push               # 同步数据库结构
npm run build                    # 构建 NestJS 项目
```

### 4. 启动 Node 项目
1.  宝塔面板 -> 网站 -> Node项目 -> 添加Node项目。
2.  **启动脚本**：选择 `backend/dist/main.js`。
3.  **运行端口**：`3000`。

---

## 三、 全局配置 (反向代理)

在 **前端站点** 的设置中添加反向代理，以便前端能够正常调用后端接口：

1.  **接口代理**：将所有 `/api/` 请求转发到后端服务。
    ```nginx
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    ```
2.  **静态资源代理**（图片上传服务）：
    ```nginx
    location /uploads/ {
        proxy_pass http://localhost:3000/uploads/;
    }
    ```

---

## 四、 常见问题排查

- **接口 404**：检查 Nginx 反向代理配置中 `proxy_pass http://localhost:3000/;` 末尾的斜杠是否写错。
- **数据库连接失败**：确保宝塔数据库管理中已放行 3306 端口（如果数据库不在本地），并检查 `.env` 配置。
- **页面显示无数据**：执行 `curl -X POST http://localhost:3000/api/wallpapers/seed` 初始化种子数据（视实际 API 而定）。
