/**
 * IPFS Integration Module for Mint My Story
 * 
 * This module provides utilities to upload media files and metadata to IPFS
 * using nft.storage. Works in both browser and serverless environments.
 */

import { NFTStorage, File } from 'nft.storage';

// Initialize NFTStorage client
// Ensure NFT_STORAGE_KEY is set in your environment variables
const getClient = (): NFTStorage => {
  // @ts-ignore - Vite import.meta.env
  const apiKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_NFT_STORAGE_KEY) || 
                 (typeof process !== 'undefined' && process.env?.NFT_STORAGE_KEY);
  
  if (!apiKey) {
    throw new Error(
      'NFT_STORAGE_KEY is not defined. Please set VITE_NFT_STORAGE_KEY in your .env file'
    );
  }
  
  return new NFTStorage({ token: apiKey });
};

/**
 * Media Upload Result
 */
export interface MediaUploadResult {
  uri: string;
  type: 'image' | 'video';
}

/**
 * Metadata Structure for Mint My Story
 */
export interface MintMyStoryMetadata {
  schema_version: string;
  title: string;
  description: string;
  creator: {
    handle: string;
    wallet: string;
  };
  source: {
    platform: string;
    post_id: string;
    permalink: string;
    timestamp: string;
  };
  media: Array<{
    type: 'image' | 'video';
    uri: string;
  }>;
  rights_attestation: {
    text: string;
    signature: string;
    signed_at: string;
  };
  license_templates?: any[];
  royalties?: any[];
}

/**
 * Detect MIME type from file extension or buffer
 */
const detectMimeType = (filename: string): string => {
  const ext = filename.toLowerCase().split('.').pop();
  
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
  };
  
  return mimeTypes[ext || ''] || 'application/octet-stream';
};

/**
 * Detect if file is image or video based on MIME type
 */
const getMediaType = (mimeType: string): 'image' | 'video' => {
  return mimeType.startsWith('video/') ? 'video' : 'image';
};

/**
 * Upload media files (images or videos) to IPFS via nft.storage
 * 
 * @param files - Array of File objects (browser) or Buffers (Node.js)
 * @returns Array of IPFS URIs in format ["ipfs://CID1", "ipfs://CID2"]
 * 
 * @example
 * // Browser usage with File objects
 * const files = [fileFromInput1, fileFromInput2];
 * const uris = await uploadMedia(files);
 * console.log(uris); // ["ipfs://bafybeig...", "ipfs://bafybeid..."]
 * 
 * @example
 * // Node.js usage with Buffers
 * const buffer = fs.readFileSync('image.jpg');
 * const uris = await uploadMedia([buffer]);
 */
export async function uploadMedia(
  files: (File | Buffer | Blob)[]
): Promise<string[]> {
  if (!files || files.length === 0) {
    throw new Error('No files provided for upload');
  }

  try {
    const client = getClient();
    const ipfsUrls: string[] = [];

    console.log(`Starting upload of ${files.length} media file(s) to IPFS...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileToUpload: File;

      // Handle Buffer objects (Node.js environment)
      if (Buffer.isBuffer(file)) {
        // Generate a filename with timestamp for uniqueness
        const timestamp = Date.now();
        const filename = `media_${timestamp}_${i}.jpg`;
        const mimeType = detectMimeType(filename);
        
        console.log(`Converting Buffer to File object: ${filename}`);
        fileToUpload = new File([new Uint8Array(file)], filename, { type: mimeType });
      } 
      // Handle File objects (browser environment)
      else if (file instanceof File) {
        fileToUpload = file;
      } 
      // Handle Blob objects
      else if (file instanceof Blob) {
        const filename = `media_${Date.now()}_${i}.jpg`;
        fileToUpload = new File([file], filename, { type: file.type });
      }
      else {
        throw new Error(`Invalid file type at index ${i}. Expected File or Buffer.`);
      }

      console.log(`Uploading file ${i + 1}/${files.length}: ${fileToUpload.name} (${fileToUpload.type})`);

      // Upload to nft.storage
      const cid = await client.storeBlob(fileToUpload);
      const ipfsUrl = `ipfs://${cid}`;
      
      ipfsUrls.push(ipfsUrl);
      console.log(`✓ Uploaded successfully: ${ipfsUrl}`);
    }

    console.log(`✓ All ${files.length} file(s) uploaded successfully`);
    return ipfsUrls;

  } catch (error) {
    console.error('Error uploading media to IPFS:', error);
    
    if (error instanceof Error) {
      throw new Error(`Media upload failed: ${error.message}`);
    }
    throw new Error('Media upload failed with unknown error');
  }
}

/**
 * Upload detailed media with type information
 * Returns structured media objects instead of just URIs
 * 
 * @param files - Array of File objects or Buffers
 * @returns Array of media objects with type and URI
 */
export async function uploadMediaWithDetails(
  files: (File | Buffer | Blob)[]
): Promise<MediaUploadResult[]> {
  if (!files || files.length === 0) {
    throw new Error('No files provided for upload');
  }

  try {
    const client = getClient();
    const results: MediaUploadResult[] = [];

    console.log(`Starting detailed upload of ${files.length} media file(s)...`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileToUpload: File;
      let mimeType: string;

      if (Buffer.isBuffer(file)) {
        const filename = `media_${Date.now()}_${i}.jpg`;
        mimeType = detectMimeType(filename);
        fileToUpload = new File([new Uint8Array(file)], filename, { type: mimeType });
      } else if (file instanceof File) {
        fileToUpload = file;
        mimeType = file.type || detectMimeType(file.name);
      } else if (file instanceof Blob) {
        const filename = `media_${Date.now()}_${i}.jpg`;
        mimeType = file.type || detectMimeType(filename);
        fileToUpload = new File([file], filename, { type: mimeType });
      } else {
        throw new Error(`Invalid file type at index ${i}`);
      }

      const mediaType = getMediaType(mimeType);
      console.log(`Uploading ${mediaType}: ${fileToUpload.name}`);

      const cid = await client.storeBlob(fileToUpload);
      const uri = `ipfs://${cid}`;

      results.push({ uri, type: mediaType });
      console.log(`✓ ${mediaType} uploaded: ${uri}`);
    }

    return results;

  } catch (error) {
    console.error('Error in detailed media upload:', error);
    throw error instanceof Error 
      ? new Error(`Detailed upload failed: ${error.message}`)
      : new Error('Detailed upload failed');
  }
}

/**
 * Upload metadata JSON to IPFS via nft.storage
 * 
 * @param metadata - Metadata object following MintMyStoryMetadata schema
 * @returns Single IPFS URI in format "ipfs://CID"
 * 
 * @example
 * const metadata = {
 *   schema_version: "1.0.0",
 *   title: "My Instagram Post",
 *   description: "A memorable moment",
 *   creator: { handle: "@johndoe", wallet: "0x123..." },
 *   source: {
 *     platform: "instagram",
 *     post_id: "ABC123",
 *     permalink: "https://instagram.com/p/ABC123",
 *     timestamp: new Date().toISOString()
 *   },
 *   media: [{ type: "image", uri: "ipfs://bafybei..." }],
 *   rights_attestation: {
 *     text: "I attest that I own the rights...",
 *     signature: "0xsignature...",
 *     signed_at: new Date().toISOString()
 *   }
 * };
 * 
 * const metadataUri = await uploadMetadata(metadata);
 * console.log(metadataUri); // "ipfs://bafybei..."
 */
export async function uploadMetadata(
  metadata: MintMyStoryMetadata | any
): Promise<string> {
  if (!metadata) {
    throw new Error('No metadata provided for upload');
  }

  try {
    const client = getClient();

    console.log('Preparing metadata for IPFS upload...');
    console.log('Metadata schema version:', metadata.schema_version);
    console.log('Title:', metadata.title);

    // Validate essential fields
    if (!metadata.title) {
      console.warn('Warning: metadata.title is missing');
    }
    if (!metadata.creator) {
      console.warn('Warning: metadata.creator is missing');
    }
    if (!metadata.media || metadata.media.length === 0) {
      console.warn('Warning: metadata.media is empty or missing');
    }

    // Convert metadata to JSON string
    const metadataJson = JSON.stringify(metadata, null, 2);
    console.log(`Metadata size: ${metadataJson.length} bytes`);

    // Create a Blob from the JSON string
    const blob = new Blob([metadataJson], { type: 'application/json' });
    
    // Upload the blob to IPFS
    console.log('Uploading metadata to IPFS...');
    const cid = await client.storeBlob(blob);
    const ipfsUrl = `ipfs://${cid}`;

    console.log(`✓ Metadata uploaded successfully: ${ipfsUrl}`);
    return ipfsUrl;

  } catch (error) {
    console.error('Error uploading metadata to IPFS:', error);
    
    if (error instanceof Error) {
      throw new Error(`Metadata upload failed: ${error.message}`);
    }
    throw new Error('Metadata upload failed with unknown error');
  }
}

/**
 * Helper function to create a complete metadata object
 * Useful for ensuring all required fields are present
 */
export function createMetadata(params: {
  title: string;
  description: string;
  creatorHandle: string;
  creatorWallet: string;
  platform: string;
  postId: string;
  permalink: string;
  mediaUris: Array<{ type: 'image' | 'video'; uri: string }>;
  attestationText: string;
  attestationSignature: string;
  licenseTemplates?: any[];
  royalties?: any[];
}): MintMyStoryMetadata {
  return {
    schema_version: '1.0.0',
    title: params.title,
    description: params.description,
    creator: {
      handle: params.creatorHandle,
      wallet: params.creatorWallet,
    },
    source: {
      platform: params.platform,
      post_id: params.postId,
      permalink: params.permalink,
      timestamp: new Date().toISOString(),
    },
    media: params.mediaUris,
    rights_attestation: {
      text: params.attestationText,
      signature: params.attestationSignature,
      signed_at: new Date().toISOString(),
    },
    license_templates: params.licenseTemplates || [],
    royalties: params.royalties || [],
  };
}

/**
 * Convert IPFS URI to HTTP URL for display purposes
 * Uses the nftstorage.link gateway
 */
export function ipfsToHttp(ipfsUri: string): string {
  if (!ipfsUri.startsWith('ipfs://')) {
    return ipfsUri;
  }
  
  const cid = ipfsUri.replace('ipfs://', '');
  return `https://nftstorage.link/ipfs/${cid}`;
}

/**
 * Verify if an IPFS URI is valid
 */
export function isValidIpfsUri(uri: string): boolean {
  return /^ipfs:\/\/[a-zA-Z0-9]+$/.test(uri);
}
