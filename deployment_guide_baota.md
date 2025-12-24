# 趣图匣子 (FunPic Box) 宝塔部署指南

本文档提供 React 前端与 NestJS 后端的快速部署步骤。

## 1. 本端准备

1.  **前端构建**：在根目录执行 `npm run build`，得到 `dist` 文件夹并压缩为 `dist.zip`。
2.  **后端打包**：压缩 `backend` 文件夹（排除 `node_modules`）为 `backend.zip`。确保包含 `prisma/dev.db`。

## 2. 前端部署

1.  **添加站点**：宝塔面板 -> 网站 -> 添加站点。域名/IP 设置好，PHP 版本选 **“纯静态”**。
2.  **上传文件**：进入站点根目录，删除默认文件，上传并解压 `dist.zip`。确保 `index.html` 在根目录。
3.  **伪静态设置**：站点设置 -> 伪静态，填入以下代码以支持 SPA 路由：
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```

## 3. 后端部署

1.  **环境要求**：软件商店安装 **PM2管理器**，Node 版本需 **v20+**。
2.  **文件存放**：在服务器 `/www/wwwroot/` 下创建目录（如 `qutu-server`），上传并解压 `backend.zip`。
3.  **初始化**：进入 `backend` 目录，通过终端执行：
    ```bash
    npm install --production
    # 必须执行以下三步以同步社交功能数据结构
    npx prisma generate
    npx prisma migrate deploy  
    # 若无法连接数据库，请检查 .env 中的 DATABASE_URL
    npm run build
    ```
4.  **启动项目**：网站 -> Node项目 -> 添加Node项目。
    - **启动脚本**：`dist/main.js`
    - **端口**：`3000`

## 4. 全局配置 (反向代理)

在**前端站点**的设置中，添加以下反向代理配置，使前端能够正常调用 API 和访问上传的图片：

```nginx
# API 代理
location /api/ {
    proxy_pass http://localhost:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# 静态资源代理
location /uploads/ {
    proxy_pass http://localhost:3000/uploads/;
    proxy_set_header Host $host;
}
```

---

## 5. 常见问题排查

- **页面白屏**：检查 `index.html` 是否在站点根目录，而非 `dist/` 目录下。
- **404 错误**：确认站点设置中的“伪静态”已配置，且 `try_files` 路径正确。
- **接口连接失败**：
    1. 确保云服务器安全组已放行 `3000` (后端) 和 `80/443` (前端) 端口。
    2. 确保宝塔面板“安全”菜单中也放行了相应端口。
- **上传大文件失败**：在宝塔 Nginx 设置 -> 性能调整中，将 `client_max_body_size` 调大（如 `50m`）。
- **我的页面显示空白**：检查控制台 Network。若请求 `/api/interactions/...` 报错 404，通常是 Nginx 转发配置遗漏了末尾斜杠 `/`；若报 500，请检查后端 PM2 日志是否有 Prisma 数据库报错。
- **端口冲突 (EADDRINUSE)**：使用 `pm2 list` 确认是否已有进程运行。若需强制停止手动运行的进程，使用 `lsof -i :3000` 查出 PID 并 `kill -9 <PID>`。

