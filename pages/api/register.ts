import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { registerAsset, type RoyaltySplit } from '../../src/utils/story';

const bodySchema = z.object({
  metadataUri: z.string().min(1),
  creatorWallet: z.string().min(1),
  royalties: z
    .array(
      z.object({
        recipient: z.string().min(1),
        bps: z
          .number()
          .int()
          .min(0)
          .max(10_000),
      }),
    )
    .default([]),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only POST is allowed',
      },
    });
  }

  try {
    const parseResult = bodySchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_BODY',
          message: 'Invalid request body',
          details: parseResult.error.flatten(),
        },
      });
    }

    const { metadataUri, creatorWallet, royalties } = parseResult.data;

    const result = await registerAsset(
      metadataUri,
      creatorWallet,
      royalties as RoyaltySplit[],
    );

    if (!result.success) {
      const status = result.error.code === 'REGISTER_ASSET_FAILED' ? 500 : 400;
      return res.status(status).json({ success: false, error: result.error });
    }

    return res.status(200).json({
      success: true,
      assetId: result.data.assetId,
      txHash: result.data.txHash,
    });
  } catch (error) {
    console.error('/api/register unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
