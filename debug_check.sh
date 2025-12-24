#!/bin/bash
echo "--- Qutu Backend (MySQL) Self-Check ---"

# 1. 检查环境变量
echo "[1/5] Checking Environment Variables (.env)..."
if [ -f "backend/.env" ]; then
    DB_URL=$(grep "DATABASE_URL" backend/.env)
    if [[ $DB_URL == *"mysql://"* ]]; then
        echo "✅ FOUND MySQL connection string in backend/.env"
    else
        echo "❌ ERROR: DATABASE_URL in backend/.env is not using mysql:// scheme."
        echo "   Example: DATABASE_URL=\"mysql://user:pass@localhost:3306/qutu\""
    fi
else
    echo "❌ ERROR: backend/.env file missing!"
fi

# 2. 检查 NestJS 进程
echo "[2/5] Checking NestJS Process (Port 3000)..."
if lsof -i :3000 > /dev/null; then
    echo "✅ Backend is listening on port 3000"
else
    echo "❌ ERROR: No process on port 3000. Please check Baota Node project log or PM2 logs."
fi

# 3. 验证 Prisma Client
echo "[3/5] Verifying Prisma Client..."
if [ -d "backend/node_modules/.prisma" ]; then
    echo "✅ Prisma Client generated"
else
    echo "❌ ERROR: Prisma Client missing. Run: cd backend && npx prisma generate"
fi

# 4. 这里的 Prisma 数据库连通性检查 (关键)
echo "[4/5] Testing Database Connection via Prisma..."
cd backend
npx prisma db pull --print > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection OK (Prisma can talk to MySQL)"
else
    echo "❌ ERROR: Database connection failed. Check your DB credentials in .env and ensure the DB user has permissions."
fi
cd ..

# 5. 检查后端构建产物
echo "[5/5] Checking Build Artifacts..."
if [ -f "backend/dist/main.js" ]; then
    echo "✅ Backend dist found"
else
    echo "❌ ERROR: Backend build missing. Run: cd backend && npm run build"
fi

echo ""
echo "--- Check Complete ---"
echo "If everything above is ✅, ensure your Baota Nginx Reverse Proxy is set correctly:"
echo "proxy_pass http://localhost:3000/;"
