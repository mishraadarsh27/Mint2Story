# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core workflows

### Install & run

- Install dependencies:
  - `npm install`
- Configure environment variables:
  - Copy `.env.example` to `.env` and fill in the required keys (`VITE_WALLETCONNECT_PROJECT_ID`, `VITE_NFT_STORAGE_KEY`, and the Supabase variables described below).
- Start dev server (Vite + React):
  - `npm run dev`
- Production build:
  - `npm run build`
- Development-mode build (faster, with dev config):
  - `npm run build:dev`
- Preview built app:
  - `npm run preview`

### Linting & type-checking

- Run ESLint on the whole project:
  - `npm run lint`
- TypeScript is compiled via Vite; there is no dedicated `npm test` or `tsc` script. For type issues, rely on editor/IDE diagnostics or `npx tsc -p tsconfig.app.json` if needed.

### Tests

- There is currently no configured test runner or `npm test` script in `package.json`.
- If you introduce a test runner (e.g. Vitest, Jest, Playwright), add the corresponding `npm` scripts and update this section with:
  - How to run the full test suite.
  - How to run a single test file or focused test.

## Project architecture

### Frontend stack

- Vite + React + TypeScript (`vite.config.ts`, `src/main.tsx`, `src/App.tsx`).
- Routing via `react-router-dom`:
  - Routes are declared in `src/App.tsx` using `BrowserRouter` and `<Routes>`.
  - Current pages live in `src/pages/`:
    - `Index.tsx` – landing page (hero, how-it-works, marketplace preview).
    - `Marketplace.tsx` – IP asset marketplace UI.
    - `Dashboard.tsx` – creator dashboard metrics.
    - `HowItWorksPage.tsx` – expanded explanation of the flow.
    - `NotFound.tsx` – 404 handler; also logs missing routes to `console.error`.
    - `Auth.tsx` – authentication / onboarding surface.
    - `AssetDetail.tsx` – detail view for a single IP asset.
- UI layer:
  - Tailwind CSS (`tailwind.config.ts`, `src/index.css`, `src/App.css`) with shadcn-ui primitives in `src/components/ui/`.
  - Higher-level layout components in `src/components/` (e.g. `Navigation`, `Hero`, `HowItWorks`, `MarketplacePreview`, `FilterSheet`, `LicenseDialog`, `Footer`).

### Global providers & configuration

- `src/components/Web3Provider.tsx` wraps the app with:
  - `WagmiProvider` (EVM wallet connectivity) using config from `src/config/web3.ts`.
  - `QueryClientProvider` from `@tanstack/react-query` for data fetching/caching.
- `src/config/web3.ts`:
  - Builds a `wagmi` config via `defaultWagmiConfig` and `createWeb3Modal`.
  - Uses multiple chains (`mainnet`, `polygon`, `arbitrum`, `optimism`, `base`).
  - Reads `VITE_WALLETCONNECT_PROJECT_ID` from env and falls back to `"YOUR_PROJECT_ID"` if unset (future changes should avoid shipping the fallback in production).
- Toasts & tooltips:
  - `@/components/ui/toaster` and `@/components/ui/sonner` are both mounted in `App.tsx`.
  - `TooltipProvider` wraps the routed tree.

### Data & integrations

- Supabase integration (`src/integrations/supabase/`):
  - `client.ts` creates a typed Supabase client using `@supabase/supabase-js` and `Database` from `types.ts`.
  - Uses env vars `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` and persists auth to `localStorage`.
  - The Supabase project itself is defined under `supabase/` (e.g. `config.toml`, `migrations/*.sql`); treat this directory as the source of truth for database schema and policies.
- IPFS / NFT storage (`src/utils/ipfs.ts`, `src/utils/IPFS_README.md`, `src/utils/ipfs.examples.ts`):
  - `ipfs.ts` is a full-featured module around `nft.storage`:
    - `uploadMedia` and `uploadMediaWithDetails` accept `File | Buffer | Blob` and upload to IPFS, returning `ipfs://` URIs plus media type information.
    - `uploadMetadata` uploads structured JSON metadata.
    - `createMetadata` builds a `MintMyStoryMetadata` object for a single Instagram-style post, including creator info, source post details, media references, rights attestation, and optional license/royalty fields.
    - Helpers `ipfsToHttp` and `isValidIpfsUri` handle gateway URLs and validation.
  - `IPFS_README.md` documents setup and provides detailed usage patterns (browser, Node, serverless, React component, Chrome extension, Next.js API). When modifying the IPFS module, keep this README in sync.
  - `ipfs.examples.ts` contains executable-style examples and higher-level flows (single upload, multiple uploads with media-type detection, complete NFT flow, Chrome extension integration, and retry logic). Use these as references when adding new IPFS-related features instead of re-inventing flows.
- Story Protocol integration (`src/utils/story.ts`):
  - Provides a thin, environment-driven service layer on top of `@story-protocol/core-sdk` using `viem`:
    - Lazily initializes a singleton `StoryClient` using env vars:
      - `STORY_PRIVATE_KEY` – operator wallet private key.
      - `STORY_TESTNET_RPC` – RPC URL for Story Protocol Testnet.
      - `STORY_REGISTRY_CONTRACT` – IP asset registry / NFT contract address.
    - Exposes high-level functions that all return a discriminated union `StoryResult<T>`:
      - `registerAsset` – registers an IP asset using an IPFS metadata URI and optional royalty splits. Prefers the composite helper `mintAndRegisterAndCreateTermsAndAttach` if available, otherwise falls back to `mintAndRegisterIpAsset` plus a secondary royalty configuration step.
      - `createTerms` – creates license/terms for an existing asset, probing the SDK for `createTerms` vs `createLicenseTerms`.
      - `attachTerms` – attaches existing terms to an asset, probing for `attachTerms` vs `attachLicenseTerms`.
      - `setRoyaltyConfig` – configures royalties using whichever royalty module method exists (`setRoyaltyConfig`, `configureRoyaltyForIp`, etc.), keeping splitting logic centralized.
    - All functions normalize errors via `normalizeError` into a common `StoryError` so callers can rely on `success` and `error` fields without throwing.
  - This module is server-side only (relies on `process.env` and Node-compatible Story SDK clients) and should be called from API routes or backend code, not directly from browser-only React components.
  - Design expectation: frontend / backend code should treat these helpers as the only touchpoint with the Story SDK (no direct `StoryClient` usage elsewhere), to keep RPC, account, and method-detection logic in one place.

### Backend & Story Protocol API layer

- Next.js-style API routes under `pages/api/` expose Story Protocol operations over HTTP:
  - `register.ts` – wraps `registerAsset` to mint/register an IP asset using an IPFS metadata URI and optional royalty splits.
  - `createTerms.ts` – wraps `createTerms` to create license/terms for an existing IP asset.
  - `attachTerms.ts` – wraps `attachTerms` to attach previously created terms to an asset.
  - `setRoyalty.ts` – wraps `setRoyaltyConfig` to configure royalty splits for an asset.
- All handlers:
  - Accept `POST` JSON bodies validated with `zod`.
  - Return a consistent response shape with `success` and, on failure, an `error` object containing `code`, `message`, and optional `details`.
- These routes are expected to run in a Node/Next-like serverless environment where the Story Protocol environment variables (see below) are available via `process.env`.

### Hooks and utilities

- Hooks in `src/hooks/`:
  - `use-mobile.tsx` and `use-toast.ts` (shadcn-style hooks) implement reusable UI behavior; prefer using them over duplicating responsive/toast logic in components.
- `src/lib/utils.ts` contains generic utilities shared across components (e.g. className helpers).

### Styling and design system

- Tailwind CSS drives layout and design tokens; `tailwind.config.ts` defines custom colors for `brand` and `sidebar`, and uses CSS variables (`--brand-purple`, etc.).
- Many components use custom utility classes such as `glass`, `gradient-text`, and `transition-smooth`, which are defined in `src/index.css` / `src/App.css`. When creating new components, follow existing class patterns for consistent look & feel.

## Environment configuration

When wiring up Web3, Supabase, IPFS, or Story Protocol, expect to supply these env vars (typically via `.env` in Vite):

- Web3 / WalletConnect:
  - `VITE_WALLETCONNECT_PROJECT_ID`
- Supabase:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `VITE_SUPABASE_PROJECT_ID` (used by Supabase tooling/hosting; not read directly in app code).
- IPFS / nft.storage:
  - `VITE_NFT_STORAGE_KEY` (browser) or `NFT_STORAGE_KEY` (Node/server environments)
- Story Protocol (server-side usage of `src/utils/story.ts` and `pages/api/*`):
  - `STORY_PRIVATE_KEY`
  - `STORY_TESTNET_RPC`
  - `STORY_REGISTRY_CONTRACT`

These env vars are used via `import.meta.env` in client code and `process.env` in server / Node contexts; do not hardcode secrets in the codebase.

## How future Warp agents should extend the app

- For new pages or routes:
  - Add a React component under `src/pages/` and register it in `src/App.tsx` (ensure custom routes are inserted above the `"*"` catch-all).
  - Reuse `Navigation` and `Footer` to keep global layout consistent.
- For new Web3 or Story Protocol flows:
  - Use `Web3Provider` and `config/web3.ts` for wallet connectivity rather than creating new providers.
  - Route all Story Protocol interactions through `src/utils/story.ts`; if a needed SDK method is missing, extend that module instead of calling the SDK directly from components.
  - When exposing new Story operations over HTTP, add a corresponding handler in `pages/api/` that validates input with `zod` and forwards to the appropriate `src/utils/story.ts` helper.
- For IPFS-related features:
  - Build on top of `src/utils/ipfs.ts` and the flows in `ipfs.examples.ts`.
  - Update `IPFS_README.md` if the public API of the IPFS module changes.
- For data fetching:
  - Prefer `@tanstack/react-query` within the `Web3Provider` context for anything that hits Supabase, Story Protocol, or other APIs; keep query/mutation hooks composable and colocate them with features.
