import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { setRoyaltyConfig, type RoyaltySplit } from '../../src/utils/story';

const bodySchema = z.object({
  assetId: z.string().min(1),
  splits: z.array(
    z.object({
      recipient: z.string().min(1),
      bps: z
        .number()
        .int()
        .min(0)
        .max(10_000),
    }),
  ),
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

    const { assetId, splits } = parseResult.data;

    const result = await setRoyaltyConfig(assetId, splits as RoyaltySplit[]);

    if (!result.success) {
      const status = result.error.code === 'SET_ROYALTY_CONFIG_FAILED' ? 500 : 400;
      return res.status(status).json({ success: false, error: result.error });
    }

    return res.status(200).json({
      success: true,
      txHash: result.data.txHash,
    });
  } catch (error) {
    console.error('/api/setRoyalty unexpected error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
  }
}
