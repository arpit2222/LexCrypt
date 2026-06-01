# LexCrypt: Privacy-First Smart Contract Language for Confidential Legal Agreements

> **We use Fully Homomorphic Encryption (FHE) via Fhenix to enable contract execution on encrypted agreement terms.**
> 
> **Problem:** Legal agreements require privacy, but blockchains expose everything.
> **Solution:** Encrypted smart contracts where only authorized parties reveal specific terms, while logic computes on encrypted data.

LexCrypt is a platform aiming to provide accessible legal tools for citizens and advanced AI assistants for lawyers, leveraging modern AI and Web3 technologies.

## Core Features

### 1. Fully Homomorphic Encryption (FHE) Legal Contracts
We use `@fhenixprotocol/contracts` to encrypt sensitive legal terms (like M&A Earnout Thresholds or Payroll Salaries) directly on-chain using `euint32`.
The smart contract computes comparisons (e.g. `actualEBITDA > targetThreshold`) on ENCRYPTED data without ever decrypting it, providing absolute privacy while maintaining verifiable execution.

### 2. Privara SDK (@reineira-os/sdk) for Confidential Escrow
Integrated Privara to enable compliant, privacy-preserving payment rails. The Citizen Dashboard routes lawyer retainer fees via encrypted FHERC20 stablecoin payments, ensuring absolute financial privacy while satisfying institutional compliance.

### 3. CoFHE React SDK
We utilize the official Fhenix React hooks (`@cofhe/sdk`, `useEncrypt`, `useWrite`, `useDecrypt`) inside the Contract Composer to manage client-side encryption and seamlessly pass ciphertext into our Smart Contracts.

### 2. Multi-Agent AI (Azure OpenAI)
Built heavily on Azure's `gpt-5.4` model.
* **Citizen Pillar**: Analyzes user issues, scores severity, and generates localized advice.
* **Lawyer Pillar**: Acts as an AI Copilot. Performs semantic research on precedents and auto-drafts court-ready legal notices.
* **Student Pillar**: Simulates a presiding judge for Moot Court practice.

### 3. Voice Accessibility & Video Infrastructure
* **Multilingual STT/TTS**: Integrated native Web Speech API. Citizens can speak their legal issues using the Mic icon.
* **Jitsi Meet WebRTC**: Embedded video conferencing directly in the Lawyer/Citizen dashboards for seamless 1-on-1 consultations.

## Documentation
Check the `/docs` folder for our Whitepaper and Use-Cases detailing the FHE Privacy Model.
