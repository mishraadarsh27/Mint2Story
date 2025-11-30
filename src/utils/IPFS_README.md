# IPFS Integration for Mint My Story

Complete production-ready IPFS module using **nft.storage** for decentralized storage of NFT media and metadata.

---

## 📦 Installation

The `nft.storage` package has already been installed:

```bash
npm install nft.storage
```

---

## 🔑 Setup

### 1. Get Your NFT.Storage API Key

1. Visit [https://nft.storage](https://nft.storage)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy your API key

### 2. Configure Environment Variables

Add your NFT.Storage API key to your `.env` file:

```bash
# .env
VITE_NFT_STORAGE_KEY=your_nft_storage_api_key_here
```

**Important:** 
- For Vite projects (like this one), use the `VITE_` prefix
- Never commit your `.env` file to version control
- Add `.env` to your `.gitignore`

---

## 📁 Files Structure

```
src/utils/
├── ipfs.ts              # Main IPFS module
├── ipfs.examples.ts     # Usage examples
└── IPFS_README.md       # This file
```

---

## 🚀 Quick Start

### Import the Functions

```typescript
import { uploadMedia, uploadMetadata, createMetadata, ipfsToHttp } from '@/utils/ipfs';
```

### Basic Usage: Upload an Image

```typescript
// From file input
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const file = fileInput.files[0];

// Upload to IPFS
const ipfsUrls = await uploadMedia([file]);
console.log(ipfsUrls[0]); // "ipfs://bafybei..."

// Convert to HTTP URL for display
const httpUrl = ipfsToHttp(ipfsUrls[0]);
console.log(httpUrl); // "https://nftstorage.link/ipfs/bafybei..."
```

---

## 🎯 Complete NFT Minting Flow

### Step 1: Upload Media Files

```typescript
import { uploadMediaWithDetails } from '@/utils/ipfs';

// Upload images/videos with type detection
const files = [
  imageFile1,  // From file input
  videoFile1,  // From file input
];

const mediaResults = await uploadMediaWithDetails(files);
// Returns: [
//   { type: 'image', uri: 'ipfs://...' },
//   { type: 'video', uri: 'ipfs://...' }
// ]
```

### Step 2: Create Metadata

```typescript
import { createMetadata } from '@/utils/ipfs';

const metadata = createMetadata({
  title: 'My Instagram Post',
  description: 'A beautiful moment captured',
  creatorHandle: '@username',
  creatorWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
  platform: 'instagram',
  postId: 'ABC123',
  permalink: 'https://instagram.com/p/ABC123',
  mediaUris: mediaResults,
  attestationText: 'I attest that I am the original creator...',
  attestationSignature: '0xsignature...',
  licenseTemplates: [],
  royalties: [
    {
      recipient: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
      percentage: 10,
    }
  ],
});
```

### Step 3: Upload Metadata

```typescript
import { uploadMetadata } from '@/utils/ipfs';

const metadataUri = await uploadMetadata(metadata);
console.log(metadataUri); // "ipfs://bafybei..."

// Now use metadataUri in your smart contract mint function
```

---

## 📚 API Reference

### `uploadMedia(files: (File | Buffer)[]): Promise<string[]>`

Uploads media files to IPFS.

**Parameters:**
- `files` - Array of File objects (browser) or Buffers (Node.js)

**Returns:**
- Array of IPFS URIs: `["ipfs://CID1", "ipfs://CID2"]`

**Example:**
```typescript
const uris = await uploadMedia([imageFile, videoFile]);
```

---

### `uploadMediaWithDetails(files: (File | Buffer)[]): Promise<MediaUploadResult[]>`

Uploads media with type detection.

**Returns:**
```typescript
[
  { type: 'image', uri: 'ipfs://...' },
  { type: 'video', uri: 'ipfs://...' }
]
```

---

### `uploadMetadata(metadata: MintMyStoryMetadata): Promise<string>`

Uploads metadata JSON to IPFS.

**Parameters:**
- `metadata` - Metadata object following the MintMyStoryMetadata schema

**Returns:**
- Single IPFS URI: `"ipfs://CID"`

---

### `createMetadata(params): MintMyStoryMetadata`

Helper function to create properly structured metadata.

**Parameters:**
```typescript
{
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
}
```

---

### `ipfsToHttp(ipfsUri: string): string`

Converts IPFS URI to HTTP URL for display.

**Example:**
```typescript
const httpUrl = ipfsToHttp('ipfs://bafybei...');
// Returns: "https://nftstorage.link/ipfs/bafybei..."
```

---

### `isValidIpfsUri(uri: string): boolean`

Validates IPFS URI format.

---

## 🎨 Metadata Schema

The metadata follows this exact structure:

```typescript
{
  schema_version: "1.0.0",
  title: string,
  description: string,
  creator: {
    handle: string,
    wallet: string
  },
  source: {
    platform: "instagram",
    post_id: string,
    permalink: string,
    timestamp: string  // ISO 8601 format
  },
  media: [
    { type: "image" | "video", uri: "ipfs://..." }
  ],
  rights_attestation: {
    text: string,
    signature: string,
    signed_at: string  // ISO 8601 format
  },
  license_templates: any[],
  royalties: any[]
}
```

---

## 🔧 Integration Examples

### React Component

```typescript
import { useState } from 'react';
import { uploadMedia, uploadMetadata, createMetadata } from '@/utils/ipfs';

function MintNFTComponent() {
  const [isUploading, setIsUploading] = useState(false);
  const [metadataUri, setMetadataUri] = useState('');

  const handleMint = async (file: File, walletAddress: string) => {
    setIsUploading(true);
    
    try {
      // Upload media
      const mediaUris = await uploadMedia([file]);
      
      // Create metadata
      const metadata = createMetadata({
        title: 'My NFT',
        description: 'Description',
        creatorHandle: '@username',
        creatorWallet: walletAddress,
        platform: 'instagram',
        postId: 'post123',
        permalink: 'https://instagram.com/p/post123',
        mediaUris: [{ type: 'image', uri: mediaUris[0] }],
        attestationText: 'I am the creator',
        attestationSignature: '0x...',
      });
      
      // Upload metadata
      const uri = await uploadMetadata(metadata);
      setMetadataUri(uri);
      
      // Now call your smart contract with uri
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return <div>...</div>;
}
```

---

### Chrome Extension Background Script

```typescript
// background.js
import { uploadMedia, uploadMetadata } from '@/utils/ipfs';

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'UPLOAD_TO_IPFS') {
    try {
      const { imageBlob, instagramData } = message.data;
      
      // Convert blob to File
      const file = new File([imageBlob], 'instagram-post.jpg', {
        type: 'image/jpeg'
      });
      
      // Upload
      const mediaUris = await uploadMedia([file]);
      
      // Create and upload metadata
      const metadata = {
        schema_version: '1.0.0',
        title: instagramData.caption,
        // ... rest of metadata
        media: [{ type: 'image', uri: mediaUris[0] }]
      };
      
      const metadataUri = await uploadMetadata(metadata);
      
      sendResponse({ success: true, metadataUri });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
});
```

---

### Next.js API Route

```typescript
// pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { uploadMetadata } from '@/utils/ipfs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const metadata = req.body;
      const metadataUri = await uploadMetadata(metadata);
      
      res.status(200).json({ 
        success: true, 
        metadataUri 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
}
```

---

## ⚠️ Important Notes

### Browser vs. Node.js

- **Browser**: Use `File` objects from file inputs or Blobs
- **Node.js**: Use `Buffer` objects - they will be automatically converted

### Serverless Compatibility

- ✅ Works in Vercel, Netlify, AWS Lambda
- ✅ No file system dependencies
- ✅ All operations use in-memory processing

### Error Handling

Always wrap uploads in try-catch blocks:

```typescript
try {
  const uris = await uploadMedia(files);
} catch (error) {
  console.error('Upload failed:', error);
  // Handle error - show user message, retry, etc.
}
```

### Rate Limits

nft.storage has generous rate limits, but for production:
- Implement retry logic (see `example5_uploadWithRetry`)
- Consider batch uploads for multiple files
- Cache IPFS URIs to avoid re-uploading

---

## 🧪 Testing

Run the example functions to test your integration:

```typescript
import { example3_completeNFTFlow } from '@/utils/ipfs.examples';

// Test complete flow
const result = await example3_completeNFTFlow();
console.log('Test result:', result);
```

---

## 🔗 Viewing Uploaded Content

All uploaded content can be viewed via IPFS gateways:

- **nft.storage gateway**: `https://nftstorage.link/ipfs/{CID}`
- **ipfs.io gateway**: `https://ipfs.io/ipfs/{CID}`
- **Cloudflare gateway**: `https://cloudflare-ipfs.com/ipfs/{CID}`

Use the `ipfsToHttp()` helper to automatically convert URIs.

---

## 🐛 Troubleshooting

### Error: "NFT_STORAGE_KEY is not defined"

**Solution:** Make sure you've added your API key to `.env` with the `VITE_` prefix:
```bash
VITE_NFT_STORAGE_KEY=your_key_here
```

### Error: "File upload failed"

**Possible causes:**
- Network connectivity issues
- Invalid API key
- File too large (nft.storage has a 100GB limit per upload)
- Rate limiting

**Solution:** Implement retry logic and check your API key.

### TypeScript errors

If you get TypeScript errors about `File` or `Buffer`:
```bash
npm install --save-dev @types/node
```

---

## 📖 Additional Resources

- [nft.storage Documentation](https://nft.storage/docs/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [NFT Metadata Standards](https://docs.opensea.io/docs/metadata-standards)

---

## ✅ Checklist

Before deploying to production:

- [ ] API key added to environment variables
- [ ] `.env` file in `.gitignore`
- [ ] Error handling implemented
- [ ] Loading states for user feedback
- [ ] Tested with real files
- [ ] Verified uploaded content is accessible via IPFS gateways
- [ ] Implemented retry logic for critical flows
- [ ] Added proper TypeScript types

---

## 💡 Best Practices

1. **Always upload media first, then metadata** - This ensures media URIs are available when creating metadata

2. **Store IPFS URIs in your database** - Don't rely on re-uploading; IPFS URIs are permanent

3. **Use `uploadMediaWithDetails`** for better type tracking - Especially useful for mixed media (images + videos)

4. **Validate files before upload** - Check file size, type, and format to avoid wasted uploads

5. **Show progress to users** - IPFS uploads can take time; provide feedback

6. **Cache HTTP URLs** - Convert IPFS URIs to HTTP once and cache the result

---

**Questions or Issues?**

Check `ipfs.examples.ts` for more detailed examples and usage patterns.
