# 趣图匣子 (FunPic Box) 宝塔部署指南

本文档提供 React 前端与 NestJS 后端的快速部署步骤。

## 1. 本端准备

1.  **前端构建**：在根目录执行 `npm run build`，得到 `dist` 文件夹并压缩为 `dist.zip`。
28.  **后端打包**：压缩 `backend` 文件夹（排除 `node_modules`）为 `backend.zip`。
9: 
10: ## 2. 数据库准备 (MySQL)
11: 
12: 1.  **宝塔侧**：宝塔面板 -> 数据库 -> 添加数据库。
13:     - **DBName**: `qutu`
14:     - **User**: `qutu_user`
15:     - **Password**: (自行设置)
16:     - **访问权限**: 建议选 "本地服务器" 以增强安全性。
17: 2.  **环境变量**：在 `backend/.env` 中修改 `DATABASE_URL`：
18:     ```env
19:     DATABASE_URL="mysql://qutu_user:password@localhost:3306/qutu"
20:     ```
21: 
22: ## 3. 前端部署
23: 
24: 1.  **添加站点**：宝塔面板 -> 网站 -> 添加站点。PHP 版本选 **“纯静态”**。
25: 2.  **上传文件**：上传并解压 `dist.zip`。
26: 3.  **伪静态设置**：站点设置 -> 伪静态：
27:     ```nginx
28:     location / {
29:         try_files $uri $uri/ /index.html;
30:     }
31:     ```
32: 
33: ## 4. 后端部署
34: 
35: 1.  **上传解压**：上传并解压 `backend.zip`。
36: 2.  **初始化**：进入 `backend` 目录执行：
37:     ```bash
38:     npm install --production
39:     npx prisma generate
40:     npx prisma migrate deploy  # 部署结构到 MySQL
41:     npm run build
42:     # 恢复分类与标签基础数据
43.     curl -X POST http://localhost:3000/api/wallpapers/seed
44:     ```
45: 3.  **启动项目**：网站 -> Node项目 -> 添加Node项目，设置启动脚本为 `dist/main.js`。
46: 
47: ## 5. 全局配置 (反向代理)
48: 
49: 在**前端站点**设置中添加：
50: 
51: ```nginx
52: location /api/ {
53:     proxy_pass http://localhost:3000/;
54:     proxy_set_header Host $host;
55: }
56: location /uploads/ {
57:     proxy_pass http://localhost:3000/uploads/;
58: }
59: ```

---

## 5. 常见问题排查

- **接口连接失败**：
    1. 确保云服务器安全组已放行 `3000` (后端) 和 `80/443` (前端) 端口。
    2. 确保宝塔面板“安全”菜单中也放行了相应端口。
- **上传大文件失败**：在宝塔 Nginx 设置 -> 性能调整中，将 `client_max_body_size` 调大（如 `50m`）。
- **我的页面显示空白/无数据**：
    1. **检查数据库路径**：确保 `.env` 中的路径是 `file:./prisma/dev.db` 而非 `file:./dev.db`。应用启动时默认在根目录查找。
    2. **清理冗余数据库**：如果 `backend/` 根目录存在多余的 `dev.db`，请将其删除，确保只保留 `backend/prisma/dev.db`。
    3. **Nginx 转发配置**：检查反向代理是否遗漏了末尾斜杠 `/`。
- **端口冲突 (EADDRINUSE)**：使用 `pm2 list` 确认是否已有进程运行。若需强制停止手动运行的进程，使用 `lsof -i :3000` 查出 PID 并 `kill -9 <PID>`。

