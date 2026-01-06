import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🚮 开始清理测试数据...')

    // 删除顺序很重要，由于外键约束
    // 按照从子表到父表的顺序删除

    // 1. 删除用户交互与日志
    await prisma.favorite.deleteMany({})
    await prisma.history.deleteMany({})
    await prisma.follow.deleteMany({})
    await prisma.aiChat.deleteMany({})
    await prisma.aiTask.deleteMany({})
    console.log('✅ 已清理用户交互、AI 任务及聊天记录')

    // 2. 删除图片数据 (保留分类和标签)
    // 注意：Image 到 Category/Tag 是多对多，Prisma 会处理中间表
    await prisma.image.deleteMany({})
    console.log('✅ 已清理所有图片记录')

    // 3. 删除用户 (如果需要保留管理员，可以在这里加过滤，但通常清理是全量)
    await prisma.user.deleteMany({})
    console.log('✅ 已清理所有用户账户')

    // 保留项说明 (不执行 deleteMany):
    // - Category (分类)
    // - Tag (标签)
    // - Topic (专题)
    // - SystemConfig (系统配置)
    // - AiModel (AI 模型配置)

    console.log('✨ 数据库清理完成！保留了分类、标签、系统配置及 AI 模型设置。')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
