# LexCrypt MVP Demo

LexCrypt: FHE-inspired legal AI on Arbitrum Sepolia with a clean RainbowKit UI.

This repo contains:
-Pitch Deck
-WhitePaper
- Solidity contracts (Registry, JudgeAssistant, WinPredictor) using a **MockFHE** library for demo/testing.
- A minimal React + RainbowKit frontend to submit encrypted case inputs and "decrypt" results.

> Note: `MockFHE.sol` is intentionally plaintext for fast demos and local testing. For real Fhenix CoFHE flows, the frontend can use `cofhejs` encryption (see CoFHE mode below) and the contracts should be swapped to the real `FHE.sol` library.

## Repo Layout
- `/Users/arpitchauhan/Desktop/akindo/LexCrypt/contracts` - Hardhat contracts + tests
- `/Users/arpitchauhan/Desktop/akindo/LexCrypt/frontend` - Vite React demo UI

## Contracts (Hardhat)

```bash
cd /Users/arpitchauhan/Desktop/akindo/LexCrypt/contracts
npm install
npm run build
npm test
```

### Deploy to Arbitrum Sepolia
Set env vars:

```bash
export ARBITRUM_SEPOLIA_RPC="https://sepolia-rollup.arbitrum.io/rpc"
export PRIVATE_KEY="0x..."
```

Then deploy (example via Hardhat console or a script you add):

```bash
npx hardhat run script/deploy.js --network arbitrumSepolia
```

## Frontend (RainbowKit)

```bash
cd /Users/arpitchauhan/Desktop/akindo/LexCrypt/frontend
npm install
npm run dev
```

### Whitepaper + Pitch Deck Pages
Place your docs here so the app can render them:
- `/Users/arpitchauhan/Desktop/akindo/LexCrypt/frontend/public/docs/LexCrypt_Whitepape.docx`
- `/Users/arpitchauhan/Desktop/akindo/LexCrypt/frontend/public/docs/LexCrypt_PitchDeck.pptx`

Note: Inline preview uses the Office web viewer and requires a public URL. In local dev, use the
Download/Open buttons instead.

### Frontend Env Vars
Create `.env` in `/Users/arpitchauhan/Desktop/akindo/LexCrypt/frontend`:

```bash
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_ARBITRUM_SEPOLIA_RPC=https://sepolia-rollup.arbitrum.io/rpc
VITE_JUDGE_ASSISTANT_ADDRESS=0xYourDeployedJudgeAssistant
VITE_WIN_PREDICTOR_ADDRESS=0xYourDeployedWinPredictor
VITE_EVIDENCE_VAULT_ADDRESS=0xYourEvidenceVault
VITE_PRACTICE_ARENA_ADDRESS=0xYourPracticeArena
VITE_PRECEDENT_ENGINE_ADDRESS=0xYourPrecedentEngine
VITE_USE_COFHE=false
```

## Demo Flow
1. Connect wallet via RainbowKit.
2. Submit encrypted case signals in **Judge AI Assistant**.
3. Click **Decrypt Latest Result** to show the verdict score.
4. Do the same for **Win Probability Engine**.

## Feature Status
Implemented:
- Smart contracts: LexCryptRegistry, JudgeAssistant, WinPredictor, EvidenceVault, PracticeArena, PrecedentEngine (MockFHE demo mode)
- Frontend: RainbowKit login, Judge AI submit + result, Win Probability submit + result, Evidence Vault, Practice Arena, Precedent Engine
- On-chain encrypted handles + IPFS CID hash storage (no backend)
- CoFHE toggle: browser encryption + permit creation + ABI switch (for Fhenix contracts)
- Tests + deploy script

Not yet implemented:
- Real FHE.sol contracts on the Fhenix network (MockFHE only for now)

## CoFHE Mode (Real Encryption)
Enable this when pointing the frontend at FHE-enabled contracts on Fhenix:

```bash
VITE_USE_COFHE=true
```

This uses `cofhejs` in the browser to encrypt inputs and generate permits before calling the contracts. The ABI switches to the CoFHE input structs automatically, so the contract must accept the encrypted input types.

## Buildathon Targets (Option 2)
- Contracts: Registry + JudgeAssistant + WinPredictor
- UI: Case submit + decrypt result
- Network: Arbitrum Sepolia

If you want, I can add deploy scripts, integrate real CoFHE encryption, or scaffold the remaining modules (EvidenceVault, PracticeArena, PrecedentEngine).
