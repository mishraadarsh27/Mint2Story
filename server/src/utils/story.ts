/**
 * Story Protocol Integration for Mint My Story (Testnet)
 *
 * This module provides high-level helpers to register IP assets, manage
 * license terms, and configure royalties on Story Protocol Testnet.
 *
 * Environment variables required (server-side only):
 * - STORY_PRIVATE_KEY        Private key for the Story Protocol operator wallet
 * - STORY_TESTNET_RPC        RPC URL for Story Protocol Testnet
 * - STORY_REGISTRY_CONTRACT  IP asset registry / NFT contract address
 */

import type { Address } from 'viem';
import { http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import {
  StoryClient,
  type StoryConfig,
} from '@story-protocol/core-sdk';

export interface RoyaltySplit {
  recipient: string;
  bps: number; // basis points (10_000 = 100%)
}

export interface StoryError {
  code: string;
  message: string;
  details?: unknown;
}

export type StoryResult<T> =
  | { success: true; data: T }
  | { success: false; error: StoryError };

export interface RegisterAssetResult {
  assetId: string;
  txHash: string;
}

export interface CreateTermsResult {
  termsId: string;
  txHash: string;
}

export interface AttachTermsResult {
  success: true;
  txHash: string;
}

export interface SetRoyaltyConfigResult {
  success: true;
  txHash: string;
}

let storyClientPromise: Promise<StoryClient> | null = null;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeError(error: unknown, code: string): StoryError {
  if (error instanceof Error) {
    return {
      code,
      message: error.message,
      details: {
        name: error.name,
        stack: error.stack,
      },
    };
  }

  return {
    code,
    message: 'Unknown Story Protocol error',
    details: error,
  };
}

async function getStoryClient(): Promise<StoryClient> {
  if (!storyClientPromise) {
    storyClientPromise = (async () => {
      try {
        const privateKey = getEnv('STORY_PRIVATE_KEY');
        const rpcUrl = getEnv('STORY_TESTNET_RPC');

        const account = privateKeyToAccount(`0x${privateKey.replace(/^0x/, '')}`);

        const config: StoryConfig = {
          chainId: "aeneid", // Story Protocol testnet
          transport: http(rpcUrl),
          account,
        };

        const client = StoryClient.newClient(config);
        return client;
      } catch (error) {
        console.error('[Story] Failed to initialize StoryClient:', error);
        throw error;
      }
    })();
  }

  return storyClientPromise;
}

function getRegistryContractAddress(): Address {
  const addr = getEnv('STORY_REGISTRY_CONTRACT');
  return addr as Address;
}

/**
 * Register an IP asset on Story Protocol Testnet.
 *
 * If the SDK exposes a composite helper `mintAndRegisterAndCreateTermsAndAttach`,
 * this function will attempt to use it. Otherwise it falls back to
 * `mintAndRegisterIpAsset` and separate royalty configuration.
 */
export async function registerAsset(
  metadataUri: string,
  creatorWallet: string,
  royalties: RoyaltySplit[] = [],
): Promise<StoryResult<RegisterAssetResult>> {
  try {
    if (!metadataUri || !metadataUri.startsWith('ipfs://')) {
      throw new Error('metadataUri must be a non-empty IPFS URI (e.g. ipfs://CID)');
    }
    if (!creatorWallet) {
      throw new Error('creatorWallet is required');
    }

    const client = await getStoryClient();
    const registryContract = getRegistryContractAddress();

    let assetId: string;
    let txHash: string;

    const ipAssetModule: any = (client as any).ipAsset;

    if (
      ipAssetModule &&
      typeof ipAssetModule.mintAndRegisterAndCreateTermsAndAttach === 'function'
    ) {
      console.log('[Story] Using composite helper mintAndRegisterAndCreateTermsAndAttach');

      const response = await ipAssetModule.mintAndRegisterAndCreateTermsAndAttach({
        registryAddress: registryContract,
        ipMetadataURI: metadataUri,
        creator: creatorWallet as Address,
        royalties: royalties?.map((r) => ({
          recipient: r.recipient as Address,
          bps: BigInt(r.bps),
        })),
      });

      assetId =
        (response &&
          (response.ipId || response.assetId || response.id || response.ipAssetId)) ||
        '';
      txHash = response?.txHash || response?.transactionHash || '';
    } else {
      console.log('[Story] Using ipAsset.mintAndRegisterIpAsset');

      const response = await (client as any).ipAsset.mintAndRegisterIpAsset({
        registryAddress: registryContract,
        ipMetadataURI: metadataUri,
        creator: creatorWallet as Address,
      });

      assetId =
        (response &&
          (response.ipId || response.assetId || response.id || response.ipAssetId)) ||
        '';
      txHash = response?.txHash || response?.transactionHash || '';

      if (!assetId || !txHash) {
        throw new Error('Story Protocol SDK did not return assetId or txHash');
      }

      if (royalties && royalties.length > 0) {
        const royaltyResult = await setRoyaltyConfig(assetId, royalties);
        if (!royaltyResult.success) {
          console.error('[Story] Failed to set royalty config during registerAsset');
        }
      }
    }

    if (!assetId || !txHash) {
      throw new Error('Failed to extract assetId or txHash from Story Protocol response');
    }

    return {
      success: true,
      data: {
        assetId,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] registerAsset error:', error);
    return {
      success: false,
      error: normalizeError(error, 'REGISTER_ASSET_FAILED'),
    };
  }
}

/**
 * Create license / terms for an existing IP asset.
 */
export async function createTerms(
  assetId: string,
  termsConfig: any,
): Promise<StoryResult<CreateTermsResult>> {
  try {
    if (!assetId) {
      throw new Error('assetId is required');
    }
    if (!termsConfig || typeof termsConfig !== 'object') {
      throw new Error('termsConfig must be a non-null object');
    }

    const client = await getStoryClient();
    const anyClient = client as any;

    let termsId: string | undefined;
    let txHash: string | undefined;

    const licenseModule: any = anyClient.license || anyClient.terms;

    if (!licenseModule) {
      throw new Error('Story Protocol SDK does not expose a license/terms module');
    }

    let response: any | undefined;

    if (typeof licenseModule.createTerms === 'function') {
      response = await licenseModule.createTerms({
        ipId: assetId,
        ...termsConfig,
      });
    } else if (typeof licenseModule.createLicenseTerms === 'function') {
      response = await licenseModule.createLicenseTerms({
        ipId: assetId,
        ...termsConfig,
      });
    } else {
      throw new Error(
        'No compatible Story Protocol createTerms function found (expected createTerms or createLicenseTerms)',
      );
    }

    termsId = response?.termsId || response?.licenseTermsId || response?.id;
    txHash = response?.txHash || response?.transactionHash;

    if (!termsId || !txHash) {
      throw new Error('Failed to extract termsId or txHash from Story Protocol response');
    }

    return {
      success: true,
      data: {
        termsId,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] createTerms error:', error);
    return {
      success: false,
      error: normalizeError(error, 'CREATE_TERMS_FAILED'),
    };
  }
}

/**
 * Attach existing terms to an IP asset.
 */
export async function attachTerms(
  assetId: string,
  termsId: string,
): Promise<StoryResult<AttachTermsResult>> {
  try {
    if (!assetId) {
      throw new Error('assetId is required');
    }
    if (!termsId) {
      throw new Error('termsId is required');
    }

    const client = await getStoryClient();
    const anyClient = client as any;

    const licenseModule: any = anyClient.license || anyClient.terms;

    if (!licenseModule) {
      throw new Error('Story Protocol SDK does not expose a license/terms module');
    }

    let response: any | undefined;

    if (typeof licenseModule.attachTerms === 'function') {
      response = await licenseModule.attachTerms({
        ipId: assetId,
        termsId,
      });
    } else if (typeof licenseModule.attachLicenseTerms === 'function') {
      response = await licenseModule.attachLicenseTerms({
        ipId: assetId,
        licenseTermsId: termsId,
      });
    } else {
      throw new Error(
        'No compatible Story Protocol attachTerms function found (expected attachTerms or attachLicenseTerms)',
      );
    }

    const txHash: string | undefined =
      response?.txHash || response?.transactionHash;

    if (!txHash) {
      throw new Error('Failed to extract txHash from Story Protocol response');
    }

    return {
      success: true,
      data: {
        success: true,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] attachTerms error:', error);
    return {
      success: false,
      error: normalizeError(error, 'ATTACH_TERMS_FAILED'),
    };
  }
}

/**
 * Configure royalty distribution for an IP asset via the Story Protocol Royalty Module.
 */
export async function setRoyaltyConfig(
  assetId: string,
  splits: RoyaltySplit[],
): Promise<StoryResult<SetRoyaltyConfigResult>> {
  try {
    if (!assetId) {
      throw new Error('assetId is required');
    }
    if (!Array.isArray(splits) || splits.length === 0) {
      throw new Error('splits must be a non-empty array');
    }

    const totalBps = splits.reduce((sum, s) => sum + s.bps, 0);
    if (totalBps > 10_000) {
      throw new Error('Total royalty BPS cannot exceed 10,000 (100%)');
    }

    const client = await getStoryClient();
    const anyClient = client as any;
    const royaltyModule: any = anyClient.royalty || anyClient.royalties;

    if (!royaltyModule) {
      throw new Error('Story Protocol SDK does not expose a royalty module');
    }

    const normalizedSplits = splits.map((s) => ({
      recipient: s.recipient as Address,
      bps: BigInt(s.bps),
    }));

    const candidateMethods = [
      'setRoyaltyConfig',
      'configureRoyaltyForIp',
      'setRoyaltyForIp',
      'configureRoyalty',
    ];

    let response: any | undefined;
    let methodUsed: string | undefined;

    for (const name of candidateMethods) {
      if (typeof royaltyModule[name] === 'function') {
        methodUsed = name;
        response = await royaltyModule[name]({
          ipId: assetId,
          splits: normalizedSplits,
        });
        break;
      }
    }

    if (!response || !methodUsed) {
      throw new Error(
        'No compatible Story Protocol royalty configuration method found on royalty module',
      );
    }

    const txHash: string | undefined =
      response?.txHash || response?.transactionHash;

    if (!txHash) {
      throw new Error('Failed to extract txHash from Story Protocol royalty response');
    }

    return {
      success: true,
      data: {
        success: true,
        txHash,
      },
    };
  } catch (error) {
    console.error('[Story] setRoyaltyConfig error:', error);
    return {
      success: false,
      error: normalizeError(error, 'SET_ROYALTY_CONFIG_FAILED'),
    };
  }
}
