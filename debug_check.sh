#!/bin/bash
echo "--- Qutu Backend Self-Check ---"
echo "[1/4] Checking NestJS Process..."
if lsof -i :3000 > /dev/null; then
    echo "✅ Backend is listening on port 3000"
else
    echo "❌ No process on port 3000. Check PM2 logs!"
fi

echo "[2/4] Verifying Prisma Client..."
if [ -d "node_modules/.prisma" ]; then
    echo "✅ Prisma Client generated"
else
    echo "❌ Prisma Client missing. Run: npx prisma generate"
fi

echo "[3/4] Testing Database Connection..."
# Check for multiple DB files
if [ -f "dev.db" ] && [ -f "prisma/dev.db" ]; then
    echo "⚠️  WARNING: Multiple dev.db files found! Delete the one in the root folder."
fi

npx prisma db pull --print > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection OK"
else
    echo "❌ Database connection failed. Ensure .env has DATABASE_URL=\"file:./prisma/dev.db\""
fi

echo "[4/4] Checking Reverse Proxy..."
echo "Please confirm in Baota Nginx Config: proxy_pass http://localhost:3000/;"
echo "--- Check Complete ---"
