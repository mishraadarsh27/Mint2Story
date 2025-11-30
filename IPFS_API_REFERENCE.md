# IPFS Module - Quick API Reference

## Import

```typescript
import { 
  uploadMedia, 
  uploadMediaWithDetails,
  uploadMetadata, 
  createMetadata,
  ipfsToHttp,
  isValidIpfsUri,
  type MintMyStoryMetadata,
  type MediaUploadResult
} from '@/utils/ipfs';
```

---

## Core Functions

### `uploadMedia(files)`

Upload images or videos to IPFS.

```typescript
uploadMedia(files: (File | Buffer | Blob)[]): Promise<string[]>
```

**Example:**
```typescript
const files = [imageFile1, imageFile2];
const uris = await uploadMedia(files);
// Returns: ["ipfs://bafybei...", "ipfs://bafybei..."]
```

---

### `uploadMediaWithDetails(files)`

Upload media with automatic type detection.

```typescript
uploadMediaWithDetails(files: (File | Buffer | Blob)[]): Promise<MediaUploadResult[]>
```

**Returns:**
```typescript
[
  { type: 'image', uri: 'ipfs://...' },
  { type: 'video', uri: 'ipfs://...' }
]
```

**Example:**
```typescript
const results = await uploadMediaWithDetails([imageFile, videoFile]);
// Use results directly in metadata
```

---

### `uploadMetadata(metadata)`

Upload metadata JSON to IPFS.

```typescript
uploadMetadata(metadata: MintMyStoryMetadata): Promise<string>
```

**Example:**
```typescript
const metadataUri = await uploadMetadata(metadata);
// Returns: "ipfs://bafybei..."
```

---

### `createMetadata(params)`

Helper to create properly structured metadata.

```typescript
createMetadata(params: {
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
}): MintMyStoryMetadata
```

**Example:**
```typescript
const metadata = createMetadata({
  title: 'My NFT',
  description: 'Description',
  creatorHandle: '@username',
  creatorWallet: '0x...',
  platform: 'instagram',
  postId: 'ABC123',
  permalink: 'https://instagram.com/p/ABC123',
  mediaUris: [{ type: 'image', uri: 'ipfs://...' }],
  attestationText: 'I am the creator',
  attestationSignature: '0x...',
});
```

---

### `ipfsToHttp(uri)`

Convert IPFS URI to HTTP URL.

```typescript
ipfsToHttp(uri: string): string
```

**Example:**
```typescript
const httpUrl = ipfsToHttp('ipfs://bafybei...');
// Returns: "https://nftstorage.link/ipfs/bafybei..."
```

---

### `isValidIpfsUri(uri)`

Validate IPFS URI format.

```typescript
isValidIpfsUri(uri: string): boolean
```

**Example:**
```typescript
if (isValidIpfsUri(uri)) {
  // URI is valid
}
```

---

## Complete Flow Example

```typescript
// 1. Upload media
const mediaFiles = [imageFile1, imageFile2];
const mediaResults = await uploadMediaWithDetails(mediaFiles);

// 2. Create metadata
const metadata = createMetadata({
  title: 'My Instagram Post',
  description: 'A beautiful moment',
  creatorHandle: '@johndoe',
  creatorWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb5',
  platform: 'instagram',
  postId: 'ABC123',
  permalink: 'https://instagram.com/p/ABC123',
  mediaUris: mediaResults,
  attestationText: 'I attest that I am the creator',
  attestationSignature: '0xsignature...',
});

// 3. Upload metadata
const metadataUri = await uploadMetadata(metadata);

// 4. Mint NFT with smart contract
await mintNFT(metadataUri);
```

---

## TypeScript Types

### `MediaUploadResult`

```typescript
interface MediaUploadResult {
  uri: string;
  type: 'image' | 'video';
}
```

### `MintMyStoryMetadata`

```typescript
interface MintMyStoryMetadata {
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
```

---

## Error Handling

```typescript
try {
  const uris = await uploadMedia(files);
} catch (error) {
  if (error instanceof Error) {
    console.error('Upload failed:', error.message);
  }
  // Handle error appropriately
}
```

---

## Environment Setup

```bash
# .env
VITE_NFT_STORAGE_KEY=your_api_key_here
```

Get your API key from [nft.storage](https://nft.storage)

---

## Common Use Cases

### Browser File Input
```typescript
const fileInput = document.getElementById('file') as HTMLInputElement;
const files = Array.from(fileInput.files);
const uris = await uploadMedia(files);
```

### From URL (fetch as Blob)
```typescript
const blob = await fetch(imageUrl).then(r => r.blob());
const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
const uris = await uploadMedia([file]);
```

### React Component
```typescript
const [uploading, setUploading] = useState(false);

const handleUpload = async (file: File) => {
  setUploading(true);
  try {
    const uris = await uploadMedia([file]);
    // Success
  } finally {
    setUploading(false);
  }
};
```

---

## Quick Links

- Full docs: `src/utils/IPFS_README.md`
- Examples: `src/utils/ipfs.examples.ts`
- Quick start: `IPFS_QUICKSTART.md`
- Source: `src/utils/ipfs.ts`

---

**Ready to mint? Just import and use!** 🚀
