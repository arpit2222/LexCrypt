# LexCrypt: Privacy-First Smart Contract Language

## Privacy Model

### Threat Model
- **Counterparty**: Curious. (Example: In an M&A deal, they want to learn my maximum reserve price during negotiations).
- **Blockchain Validators**: Curious. (Passive observers monitoring state changes on the public ledger).
- **Smart Contract**: Trusted for execution computation, but entirely untrusted for secrecy. 

### Privacy Guarantees
LexCrypt achieves three core privacy guarantees that make blockchain viable for the $200B Legal Tech industry:

1. **Semantic Security**: Contract terms stored on-chain are computationally indistinguishable from random noise.
2. **Execution Privacy**: Computations on encrypted data (e.g. `actualEBITDA > targetThreshold`) reveal absolutely nothing about the input operands.
3. **Audit Trail Verifiability**: Proves contract execution happened correctly according to the law, without exposing the specific terms to regulators or the public.

### FHE Implementation
LexCrypt uses Fhenix's CoFHE (Coprocessor Fully Homomorphic Encryption) stack to achieve this:
- We use `euint32` for sensitive contract values like Purchase Prices, Severance Thresholds, and Expiration Deadlines.
- We perform comparison operations directly on encrypted data using `FHEMath.sol`.
- On-chain verification of encrypted computation is handled natively, allowing conditional token transfers without decryption.
