// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhenixprotocol/contracts/FHE.sol";

contract NyayaFHE {
    struct Case {
        address citizen;
        euint8 encryptedSeverity;
        bool isResolved;
    }
    
    mapping(uint256 => Case) public cases;
    uint256 public caseCount;

    event CaseSubmitted(uint256 indexed caseId, address indexed citizen);

    // Citizen submits their legal case severity score completely encrypted
    function submitEncryptedCase(inEuint8 memory _encryptedScore) public {
        euint8 score = FHE.asEuint8(_encryptedScore);
        cases[caseCount] = Case(msg.sender, score, false);
        
        emit CaseSubmitted(caseCount, msg.sender);
        caseCount++;
    }

    // A view function that computes ON encrypted data without decrypting it.
    // It returns an encrypted boolean: True if score > 50 (High Severity).
    // In Fhenix, returning encrypted data allows an authorized user to decrypt it client-side.
    function isHighSeverity(uint256 _caseId) public view returns (ebool) {
        Case storage c = cases[_caseId];
        return FHE.gt(c.encryptedSeverity, FHE.asEuint8(50));
    }
}
