/**
 * IPFS Integration Usage Examples
 * 
 * This file contains practical examples of how to use the IPFS module
 * in different scenarios within Mint My Story.
 */

import {
  uploadMedia,
  uploadMediaWithDetails,
  uploadMetadata,
  createMetadata,
  ipfsToHttp,
  MintMyStoryMetadata,
} from './ipfs';

/**
 * ============================================================================
 * EXAMPLE 1: Upload a Single Image from Browser File Input
 * ============================================================================
 * 
 * Use case: User selects an image file from their device
 */
export async function example1_uploadSingleImage() {
  try {
    // Simulate getting a file from an HTML file input
    // In real code: const fileInput = document.getElementById('file-input') as HTMLInputElement;
    // const file = fileInput.files[0];
    
    // For this example, let's assume we have a File object
    const file = new File(['fake image data'], 'my-photo.jpg', { type: 'image/jpeg' });
    
    console.log('Example 1: Uploading single image...');
    
    // Upload to IPFS
    const ipfsUrls = await uploadMedia([file]);
    
    console.log('Upload complete!');
    console.log('IPFS URL:', ipfsUrls[0]);
    console.log('HTTP URL:', ipfsToHttp(ipfsUrls[0]));
    
    return ipfsUrls[0];
    
  } catch (error) {
    console.error('Example 1 failed:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * EXAMPLE 2: Upload Multiple Media Files with Type Detection
 * ============================================================================
 * 
 * Use case: User selects multiple images/videos from Instagram carousel
 */
export async function example2_uploadMultipleMediaWithDetails() {
  try {
    // Simulate multiple files from Instagram carousel
    const files = [
      new File(['image1 data'], 'carousel-1.jpg', { type: 'image/jpeg' }),
      new File(['image2 data'], 'carousel-2.png', { type: 'image/png' }),
      new File(['video data'], 'carousel-3.mp4', { type: 'video/mp4' }),
    ];
    
    console.log('Example 2: Uploading multiple media files...');
    
    // Upload with detailed information
    const mediaResults = await uploadMediaWithDetails(files);
    
    console.log('All media uploaded successfully!');
    mediaResults.forEach((media, index) => {
      console.log(`File ${index + 1}:`, {
        type: media.type,
        uri: media.uri,
        httpUrl: ipfsToHttp(media.uri),
      });
    });
    
    return mediaResults;
    
  } catch (error) {
    console.error('Example 2 failed:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * EXAMPLE 3: Complete Flow - Upload Media + Metadata
 * ============================================================================
 * 
 * Use case: Full NFT minting process for an Instagram post
 */
export async function example3_completeNFTFlow() {
  try {
    console.log('Example 3: Complete NFT minting flow...');
    
    // Step 1: Upload media files
    console.log('\nStep 1: Uploading media...');
    const mediaFiles = [
      new File(['instagram photo'], 'instagram-post.jpg', { type: 'image/jpeg' }),
    ];
    
    const mediaResults = await uploadMediaWithDetails(mediaFiles);
    console.log('✓ Media uploaded:', mediaResults);
    
    // Step 2: Create metadata object
    console.log('\nStep 2: Creating metadata...');
    const metadata = createMetadata({
      title: 'Sunset at the Beach',
      description: 'A beautiful sunset captured during my vacation in Malibu',
      creatorHandle: '@johndoe',
      creatorWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
      platform: 'instagram',
      postId: 'C9XYZ123ABC',
      permalink: 'https://instagram.com/p/C9XYZ123ABC',
      mediaUris: mediaResults,
      attestationText: 'I attest that I am the original creator of this content and have the rights to mint it as an NFT.',
      attestationSignature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      licenseTemplates: [
        {
          type: 'commercial',
          terms: 'Standard commercial license with attribution',
        },
      ],
      royalties: [
        {
          recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
          percentage: 10,
        },
      ],
    });
    
    console.log('✓ Metadata created');
    
    // Step 3: Upload metadata to IPFS
    console.log('\nStep 3: Uploading metadata...');
    const metadataUri = await uploadMetadata(metadata);
    console.log('✓ Metadata uploaded:', metadataUri);
    
    // Step 4: Return all URIs for smart contract interaction
    const result = {
      metadataUri,
      metadataHttpUrl: ipfsToHttp(metadataUri),
      mediaUris: mediaResults.map(m => ({
        type: m.type,
        ipfsUri: m.uri,
        httpUrl: ipfsToHttp(m.uri),
      })),
    };
    
    console.log('\n✓ Complete NFT data ready for minting:');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('Example 3 failed:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * EXAMPLE 4: Upload from Chrome Extension (Message Passing)
 * ============================================================================
 * 
 * Use case: Chrome extension scrapes Instagram, sends data to background script
 */
export async function example4_chromeExtensionUpload(
  imageBlob: Blob,
  instagramData: {
    postId: string;
    permalink: string;
    caption: string;
    username: string;
  }
) {
  try {
    console.log('Example 4: Chrome extension upload...');
    
    // Convert Blob to File
    const file = new File([imageBlob], `instagram-${instagramData.postId}.jpg`, {
      type: 'image/jpeg',
    });
    
    // Upload media
    const mediaUris = await uploadMedia([file]);
    
    // Create metadata (wallet would come from connected Web3 wallet)
    const metadata: MintMyStoryMetadata = {
      schema_version: '1.0.0',
      title: instagramData.caption.slice(0, 100) || 'Instagram Post',
      description: instagramData.caption,
      creator: {
        handle: `@${instagramData.username}`,
        wallet: '0x0000000000000000000000000000000000000000', // To be filled by user
      },
      source: {
        platform: 'instagram',
        post_id: instagramData.postId,
        permalink: instagramData.permalink,
        timestamp: new Date().toISOString(),
      },
      media: [
        {
          type: 'image',
          uri: mediaUris[0],
        },
      ],
      rights_attestation: {
        text: 'Pending signature',
        signature: '0x', // To be signed by user
        signed_at: new Date().toISOString(),
      },
    };
    
    // Upload metadata
    const metadataUri = await uploadMetadata(metadata);
    
    console.log('✓ Upload complete from extension');
    return { mediaUris, metadataUri };
    
  } catch (error) {
    console.error('Example 4 failed:', error);
    throw error;
  }
}

/**
 * ============================================================================
 * EXAMPLE 5: Error Handling and Retry Logic
 * ============================================================================
 * 
 * Use case: Robust upload with retry on failure
 */
export async function example5_uploadWithRetry(
  files: File[],
  maxRetries = 3
) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      console.log(`Upload attempt ${attempt + 1}/${maxRetries}...`);
      
      const results = await uploadMediaWithDetails(files);
      console.log('✓ Upload successful!');
      return results;
      
    } catch (error) {
      attempt++;
      
      if (attempt >= maxRetries) {
        console.error('Max retries reached. Upload failed.');
        throw new Error(`Upload failed after ${maxRetries} attempts: ${error}`);
      }
      
      console.warn(`Attempt ${attempt} failed. Retrying in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

/**
 * ============================================================================
 * EXAMPLE JSON RESPONSE
 * ============================================================================
 */
export const exampleJsonResponse = {
  success: true,
  nft: {
    metadataUri: 'ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    metadataHttpUrl: 'https://nftstorage.link/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    metadata: {
      schema_version: '1.0.0',
      title: 'Sunset at the Beach',
      description: 'A beautiful sunset captured during my vacation in Malibu',
      creator: {
        handle: '@johndoe',
        wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
      },
      source: {
        platform: 'instagram',
        post_id: 'C9XYZ123ABC',
        permalink: 'https://instagram.com/p/C9XYZ123ABC',
        timestamp: '2025-11-13T11:35:00.000Z',
      },
      media: [
        {
          type: 'image',
          uri: 'ipfs://bafybeibhwfzx6oo5rymsxmkdxpmkujcejbxvenxcvgojp33zvqb7x6qnrq',
        },
      ],
      rights_attestation: {
        text: 'I attest that I am the original creator of this content and have the rights to mint it as an NFT.',
        signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        signed_at: '2025-11-13T11:35:00.000Z',
      },
      license_templates: [
        {
          type: 'commercial',
          terms: 'Standard commercial license with attribution',
        },
      ],
      royalties: [
        {
          recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
          percentage: 10,
        },
      ],
    },
    mediaFiles: [
      {
        type: 'image',
        ipfsUri: 'ipfs://bafybeibhwfzx6oo5rymsxmkdxpmkujcejbxvenxcvgojp33zvqb7x6qnrq',
        httpUrl: 'https://nftstorage.link/ipfs/bafybeibhwfzx6oo5rymsxmkdxpmkujcejbxvenxcvgojp33zvqb7x6qnrq',
      },
    ],
  },
  timestamp: '2025-11-13T11:35:00.000Z',
};

/**
 * ============================================================================
 * How to run these examples:
 * ============================================================================
 * 
 * import { example1_uploadSingleImage, example3_completeNFTFlow } from '@/utils/ipfs.examples';
 * 
 * // Run example 1
 * const ipfsUrl = await example1_uploadSingleImage();
 * 
 * // Run example 3 (complete flow)
 * const nftData = await example3_completeNFTFlow();
 */
