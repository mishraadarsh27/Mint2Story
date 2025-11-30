import express, { Request, Response } from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';
import { registerAsset } from '../utils/story';

const router = express.Router();

// Create Asset
router.post('/', authenticateToken, async (req: any, res: Response) => {
    const { title, description, category, price, image_url, metadata } = req.body;

    try {
        let assetId = '';
        let txHash = '';
        let storyMetadata = {};

        // If metadata contains necessary info, try to register on Story Protocol
        if (metadata && metadata.metadataUri && metadata.creatorWallet) {
            console.log('Registering asset on Story Protocol...');
            const result = await registerAsset(
                metadata.metadataUri,
                metadata.creatorWallet,
                metadata.royalties || []
            );

            if (result.success) {
                assetId = result.data.assetId;
                txHash = result.data.txHash;
                console.log(`Registered asset: ${assetId}, tx: ${txHash}`);
            } else {
                console.error('Story Protocol registration failed:', result.error);
                // We continue to create the asset in DB even if Story Protocol fails,
                // but we might want to return an error or warning.
                // For now, we'll log it and proceed.
            }
        }

        // Update metadata with Story Protocol info
        const finalMetadata = {
            ...metadata,
            storyProtocol: {
                assetId,
                txHash
            }
        };

        const asset = await prisma.asset.create({
            data: {
                title,
                description,
                category,
                price: parseFloat(price),
                image_url,
                metadata: JSON.stringify(finalMetadata),
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
