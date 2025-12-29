import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting seeding...');

    // 1. Categories
    const categories = [
        '手机壁纸',
        '电脑壁纸',
        '个性头像',
        '动态图',
        '极致简约',
        '暗黑系',
        '自然风光',
        '赛博朋克',
    ];

    console.log('📦 Seeding categories...');
    for (const name of categories) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    // 2. Tags
    const tags = [
        '4K',
        '赛博朋克',
        '森系',
        '极简',
        '二次元',
        '治愈系',
        '美学',
        'City',
        'Girl',
        'Portrait',
        'Abstract',
        'Neon',
        '插画',
        '萌宠',
    ];

    console.log('🏷️ Seeding tags...');
    for (const name of tags) {
        await prisma.tag.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    // 3. Topics (专题)
    const topics = [
        {
            title: '冬日物语',
            description: '收集冬天的第一份温柔，雪景与暖阳的邂逅。',
            sortOrder: 10,
            isActive: true,
            status: 'APPROVED',
        },
        {
            title: '极简主义',
            description: 'Less is More. 追求极致的纯净与空间感。',
            sortOrder: 5,
            isActive: true,
            status: 'APPROVED',
        },
        {
            title: '赛博霓虹',
            description: '穿梭在霓虹闪烁的未来城市，感受赛博朋克的魅力。',
            sortOrder: 8,
            isActive: true,
            status: 'APPROVED',
        },
    ];

    console.log('📂 Seeding topics...');
    for (const topic of topics) {
        await prisma.topic.upsert({
            where: { title: topic.title },
            update: topic,
            create: topic,
        });
    }

    // 4. Approve existing pending images
    // 5. Default AI Models
    console.log('🤖 Seeding AI models...');
    const defaultModels = [
        { type: 'CHAT', vendor: 'openai', name: 'gpt-4o', displayName: 'GPT-4o Pro', sortOrder: 100 },
        { type: 'CHAT', vendor: 'aliyun', name: 'qwen-plus', displayName: '通义千问 Plus', sortOrder: 90 },
        { type: 'CHAT', vendor: 'deepseek', name: 'deepseek-chat', displayName: 'DeepSeek V3', sortOrder: 80 },
        { type: 'IMAGE', vendor: 'openai', name: 'dall-e-3', displayName: 'DALL-E 3', sortOrder: 100 },
        { type: 'IMAGE', vendor: 'aliyun', name: 'flux', displayName: 'Flux.1 极速版', sortOrder: 90 },
    ];

    for (const model of defaultModels) {
        await prisma.aiModel.upsert({
            where: { id: defaultModels.indexOf(model) + 1 }, // Simple ID fallback or use unique name/type combo
            update: model,
            create: model,
        });
    }

    console.log('✨ Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
