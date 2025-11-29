import express from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Create Asset
router.post('/', authenticateToken, async (req: any, res) => {
    const { title, description, category, price, image_url, metadata } = req.body;

    try {
        const asset = await prisma.asset.create({
            data: {
                title,
                description,
                category,
                price: parseFloat(price),
                image_url,
                metadata: JSON.stringify(metadata),
                creator_id: req.user.id,
            },
        });
        res.json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create asset' });
    }
});

// List Assets
router.get('/', async (req, res) => {
    try {
        const assets = await prisma.asset.findMany({
            include: {
                creator: {
                    select: { email: true, wallet_address: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch assets' });
    }
});

// Get Asset
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const asset = await prisma.asset.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { email: true, wallet_address: true },
                },
            },
        });
        if (!asset) return res.status(404).json({ error: 'Asset not found' });
        res.json(asset);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch asset' });
    }
});

export default router;
