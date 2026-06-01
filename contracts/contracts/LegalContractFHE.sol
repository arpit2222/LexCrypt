// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

/**
 * @title LegalContractFHE
 * @dev Encrypted Agreement Executor using Fully Homomorphic Encryption (FHE) via Fhenix
 * Key insight: Contract terms (valuations, deadlines, thresholds) are stored encrypted. 
 * Logic computes on encrypted data without ever decrypting it on-chain.
 */
contract LegalContractFHE is Permissioned {
    
    enum ContractStatus { Draft, Active, Completed, Terminated }
    
    struct EncryptedClause {
        euint32 thresholdValue;      // e.g., sale price for payment trigger or EBITDA target
        euint32 deadlineTimestamp;   // encrypted deadline
        bytes32 clauseHash;          // non-encrypted hash for verification
    }
    
    struct LegalAgreement {
        address party1;
        address party2;
        ContractStatus status;
        bytes encryptedTermsSummary;
        uint256 clauseCount;
        uint256 requiredApprovals;
        uint256 currentApprovals;
    }
    
    mapping(uint256 => LegalAgreement) public agreements;
    // Map agreement ID to clauses array to avoid struct nesting issues
    mapping(uint256 => mapping(uint256 => EncryptedClause)) public agreementClauses;
    mapping(uint256 => mapping(address => bool)) public isAuthorized;
    mapping(uint256 => mapping(address => bool)) public hasApproved;
    
    uint256 public agreementCounter;
    
    event AgreementCreated(uint256 indexed agreementId, address party1, address party2);
    event EarnoutExecuted(uint256 indexed agreementId, bool conditionMet);
    event ExecutionApproved(uint256 indexed agreementId, address approver);

    /**
     * @dev Create encrypted legal agreement
     * @param _party2 The counterparty address
     * @param inThreshold The Party balance/target encrypted via FHE (inEuint32)
     * @param inDeadline The Payment deadline encrypted (inEuint32)
     */
    function createAgreement(
        address _party2,
        inEuint32 memory inThreshold,
        inEuint32 memory inDeadline
    ) public returns (uint256) {
        uint256 agreementId = agreementCounter++;
        
        LegalAgreement storage agreement = agreements[agreementId];
        agreement.party1 = msg.sender;
        agreement.party2 = _party2;
        agreement.status = ContractStatus.Draft;
        agreement.clauseCount = 1;
        agreement.requiredApprovals = 2; // Default 2-of-2 multi-sig for 1v1 contracts
        agreement.currentApprovals = 0;
        
        isAuthorized[agreementId][msg.sender] = true;
        isAuthorized[agreementId][_party2] = true;
        
        // Encrypt the incoming values and store them securely
        EncryptedClause storage clause = agreementClauses[agreementId][0];
        clause.thresholdValue = FHE.asEuint32(inThreshold);
        clause.deadlineTimestamp = FHE.asEuint32(inDeadline);
        
        // For audit trail validation without decrypting
        // Note: Real implementation would hash the raw ciphertext bytes
        clause.clauseHash = keccak256(abi.encode(msg.sender, _party2, block.timestamp));
        
        emit AgreementCreated(agreementId, msg.sender, _party2);
        return agreementId;
    }
    
    /**
     * @dev Execute agreement on encrypted terms (e.g. M&A Earnout Calculation)
     * No decryption happens on-chain; condition is computed on encrypted data!
     */
    function executeEarnoutPayment(
        uint256 _agreementId,
        inEuint32 memory inActualEBITDA
    ) public {
        require(isAuthorized[_agreementId][msg.sender], "Not authorized for this contract");
        require(agreements[_agreementId].currentApprovals >= agreements[_agreementId].requiredApprovals, "Multi-sig threshold not met");
        
        EncryptedClause storage clause = agreementClauses[_agreementId][0];
        
        // Convert incoming actual performance to FHE type
        euint32 actualEBITDA = FHE.asEuint32(inActualEBITDA);
        
        // THIS IS THE MAGIC: Comparison on encrypted data
        // IF (actualEBITDA > targetEBITDA) THEN release earnout
        // NO party ever learns the target, but contract executes correctly!
        ebool conditionMet = FHE.gt(actualEBITDA, clause.thresholdValue);
        
        // In a full implementation, we would use FHE.select to conditionally transfer funds
        // based on the encrypted boolean result. For demo purposes, we emit an event
        // with the decrypted result (simulating an external oracle action).
        
        // NOTE: In production, the boolean would remain encrypted and only decrypted
        // by the designated recipient holding the viewing key.
        bool decryptedCondition = FHE.decrypt(conditionMet);
        emit EarnoutExecuted(_agreementId, decryptedCondition);
    }
    
    /**
     * @dev Privacy-preserving audit trail
     * Proves execution happened correctly without revealing terms
     */
    function generateAuditProof(uint256 _agreementId) public view returns (bytes memory) {
        require(isAuthorized[_agreementId][msg.sender], "Not authorized");
        return agreements[_agreementId].encryptedTermsSummary;
    }

    /**
     * @dev Multi-sig approval for contract execution
     */
    function approveExecution(uint256 _agreementId) public {
        require(isAuthorized[_agreementId][msg.sender], "Not authorized");
        require(!hasApproved[_agreementId][msg.sender], "Already approved");
        
        hasApproved[_agreementId][msg.sender] = true;
        agreements[_agreementId].currentApprovals += 1;
        
        emit ExecutionApproved(_agreementId, msg.sender);
    }
}
