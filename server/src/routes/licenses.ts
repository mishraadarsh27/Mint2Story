import express from 'express';
import prisma from '../db';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Purchase License
router.post('/purchase', authenticateToken, async (req: any, res) => {
    const { assetId, pricePaid, transactionHash, buyerWallet } = req.body;

    try {
        const license = await prisma.license.create({
            data: {
                asset_id: assetId,
                buyer_id: req.user.id,
                buyer_wallet: buyerWallet,
                price_paid: parseFloat(pricePaid),
                transaction_hash: transactionHash,
            },
        });

        // Update asset licenses count (optional, if we track it in Asset model, but we can just count licenses)
        // For now, we just return the license
        res.json(license);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to purchase license' });
    }
});

export default router;
