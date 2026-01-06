#!/bin/bash

# Qutu 一键部署脚本 (适用于 Linux/宝塔环境)

echo "🚀 开始一键部署流程..."

# 1. 前端构建 (uni-app H5)
echo "📦 正在构建 H5 前端..."
npm install --legacy-peer-deps
npm run build:h5

if [ $? -eq 0 ]; then
    echo "✅ 前端构建成功: dist/build/h5"
else
    echo "❌ 前端构建失败"
    exit 1
fi

# 2. 后端构建 (NestJS)
echo "⚙️ 正在构建后端服务..."
cd backend
# 必须先安装全部依赖以获取 nest 和 prisma 命令行工具
npm install --legacy-peer-deps

# Prisma 初始化 - 强制使用 5.22.0 版本以避免 Prisma 7 的重大变更报错
echo "💎 同步数据库结构..."
npx prisma@5.22.0 generate
npx prisma@5.22.0 db push

# 构建 NestJS
npx nest build

if [ $? -eq 0 ]; then
    echo "✅ 后端构建成功"
    # 构建完成后可以清理开发依赖 (可选)
    # npm prune --production
else
    echo "❌ 后端构建失败"
    exit 1
fi

cd ..

echo "------------------------------------------------"
echo "🎉 部署准备完成！"
echo "请确保宝塔面板中的站点配置如下："
echo "1. 前端站点运行目录: dist/build/h5"
echo "2. Node 项目管理器启动文件: backend/dist/main.js"
echo "------------------------------------------------"
