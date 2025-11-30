import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'creator@example.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Creator
    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            password_hash: hashedPassword,
            wallet_address: '0x1234567890123456789012345678901234567890',
        },
    });

    console.log({ user });

    // Create Asset
    const asset = await prisma.asset.create({
        data: {
            title: 'Seeded Asset',
            description: 'This is a test asset created via seed script.',
            price: 0.05,
            category: 'Art',
            image_url: 'https://picsum.photos/200',
            creator_id: user.id,
        },
    });

    console.log({ asset });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
