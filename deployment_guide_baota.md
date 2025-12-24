# 趣图匣子 (FunPic Box) 宝塔部署指南 (MySQL 版)

本文档提供 React 前端与 NestJS 后端由 SQLite 迁移至 MySQL 的快速部署步骤。

## 1. 本端准备

1.  **前端构建**：在根目录执行 `npm run build`，得到 `dist` 文件夹并压缩为 `dist.zip`。
2.  **后端打包**：压缩 `backend` 文件夹（排除 `node_modules`）为 `backend.zip`。

## 2. 数据库准备 (MySQL)

1.  **宝塔侧**：宝塔面板 -> 数据库 -> 添加数据库。
    - **DBName**: `qutu`
    - **User**: `qutu_user`
    - **Password**: (自行设置)
2.  **环境变量**：在 `backend/.env` 中修改 `DATABASE_URL`：
    ```env
    DATABASE_URL="mysql://qutu_user:password@localhost:3306/qutu"
    ```

## 3. 前端部署

1.  **添加站点**：宝塔面板 -> 网站 -> 添加站点。PHP 版本选 **“纯静态”**。
2.  **上传文件**：上传并解压 `dist.zip` 到站点根目录。
3.  **伪静态设置**：站点设置 -> 伪静态：
    ```nginx
    location / {
        try_files $uri $uri/ /index.html;
    }
    ```

## 4. 后端部署

1.  **上传解压**：上传并解压 `backend.zip` 到服务器目录。
2.  **初始化 (核心步骤)**：进入 `backend` 目录执行：
    ```bash
    npm install --production
    
    # 💥 重要：解决 P3019 错误 (Provider 切换)
    # 删除旧的 SQLite 迁移文件夹
    rm -rf prisma/migrations
    
    # 生成 MySQL Client
    npx prisma generate
    
    # 💥 将模型直推到 MySQL 数据库 (如果提示 P3005 非空，使用 --force-reset)
    npx prisma db push --force-reset
    
    # 构建并种子化数据
    npm run build
    curl -X POST http://localhost:3000/api/wallpapers/seed
    ```
3.  **启动项目**：网站 -> Node项目 -> 添加Node项目。
    - **启动脚本**: `dist/main.js` (如果编译后在 `dist/src/main.js`，请以实际为准)
    - **端口**: `3000`

## 5. 全局配置 (反向代理)

在**前端站点**设置中添加反向代理：

```nginx
# API 代理 (注意末尾斜杠)
location /api/ {
    proxy_pass http://localhost:3000/;
    proxy_set_header Host $host;
}

# 资源代理
location /uploads/ {
    proxy_pass http://localhost:3000/uploads/;
}
```

---

- **P3019 报错**：请务必执行 `rm -rf prisma/migrations`，因为旧的 SQLite 迁移记录无法在 MySQL 上运行。
- **页面显示无数据**：
    1. 检查 `.env` 中的 `DATABASE_URL` 是否正确。
    2. 确保已执行 `npx prisma db push`。
    3. 确认 Nginx 的 `proxy_pass` 目标 URL 带有末尾的 `/`。
- **接口 404**：
    - 多半是 Nginx 伪静态或反向代理路径配置错误。
    - 检查前端源码中的 `fetch` 请求地址（应为 `/api/...`）。
- **后端无法启动**：
    - 执行项目根目录的 `./debug_check.sh` 查看报错。
    - **查看日志 (核心)**：在宝塔面板 -> 网站 -> Node 项目 -> 对应项目 -> 日志 按钮中查看具体的运行报错。
    - 检查 MySQL 用户权限：确保数据库用户具有 `CREATE`, `ALTER`, `DROP` 等权限。
- **静态资源 (图片) 无法显示**：
    - 检查 Nginx 是否配置了 `/uploads/` 的反向代理。
    - 确认 `backend/uploads` 目录是否存在且具有读写权限。
