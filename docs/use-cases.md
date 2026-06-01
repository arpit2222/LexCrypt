# LexCrypt Use Cases

## Use Case 1: Confidential M&A Agreement (Earnouts)

**Scenario**: 
Company A and Company B are negotiating an asset purchase. 
- Purchase price: $50M (Company A's absolute max budget, Company B's minimum reserve)
- Earnout clause: An additional $5M if EBITDA > $20M (Company B's profit margin).

**The Traditional Blockchain Problem**: 
All parties, competitors, and validators can see the price, timeline, and the exact earnout formula. Company B's reserve price is visible, instantly destroying their negotiating power. Because of this, Fortune 500 companies refuse to put M&A contracts on-chain.

**The LexCrypt Solution**:
- Purchase price and EBITDA targets are stored as `euint32` (Fully Homomorphically Encrypted).
- The LexCrypt smart contract executes: `IF (actualEBITDA > encryptedEarnoutThreshold) THEN release payment`.
- No party ever sees the counterparty's reserve or margin metrics. The deal DOES go on-chain, and privacy is mathematically preserved.

---

## Use Case 2: Government Procurement (RFP Response)

**Scenario**:
The Federal Government issues an RFP for defense software. Contractors submit competitive bids. The winner is selected by the lowest price, without revealing any losing bid to the public or competitors.

**The Traditional Blockchain Problem**: 
All bids on Ethereum are visible in the mempool and on the ledger. This defeats the entire purpose of a sealed-bid auction, allowing front-running and bid-sniping.

**The LexCrypt Solution**:
- Each contractor's bid is stored as an encrypted `euint32`.
- The smart contract: 1) Receives encrypted bids, 2) Compares them using FHE without decrypting, 3) Selects the winner.
- Only the winner's bid is ever decrypted. A perfect sealed-bid auction, on-chain, and provably fair.

---

## Use Case 3: Enterprise Payroll Compliance (GDPR)

**Scenario**:
A multinational enterprise wants to process payroll on-chain for transparency and automated disbursement, but must maintain strict privacy to comply with GDPR and CCPA.

**The Traditional Blockchain Problem**: 
Salary data on a public chain constitutes an immediate, massive data breach and regulatory violation.

**The LexCrypt Solution**:
- Employee salaries are encrypted and stored on-chain.
- Payment verification computes on the encrypted salary: `IF salary > encrypted_min_wage THEN approve_transfer`.
- Auditors can prove the payroll executed correctly WITHOUT exposing individual salaries. 
- 100% GDPR compliant because Personally Identifiable Information (PII) is never unencrypted on-chain.
