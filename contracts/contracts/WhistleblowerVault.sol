// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

/**
 * @title WhistleblowerVault
 * @dev Secure vault for anonymous corporate whistleblowers.
 * Evidence (IPFS CID) is stored. It can only be released if an encrypted deadline passes
 * without the whistleblower checking in (acting as a dead-man's switch).
 */
contract WhistleblowerVault is Permissioned {
    
    struct Vault {
        address whistleblower;
        string encryptedEvidenceCID; // e.g., LitProtocol or FHE encrypted IPFS hash
        euint32 encryptedReleaseTimestamp; // Dead-man's switch deadline
        bool isTriggered;
    }
    
    mapping(uint256 => Vault) public vaults;
    uint256 public vaultCounter;
    
    event VaultCreated(uint256 indexed vaultId);
    event DeadMansSwitchCheckedIn(uint256 indexed vaultId);
    event EvidenceReleased(uint256 indexed vaultId);
    
    function createVault(string memory _encryptedEvidenceCID, inEuint32 memory _inEncryptedDeadline) public returns (uint256) {
        uint256 id = vaultCounter++;
        
        vaults[id] = Vault({
            whistleblower: msg.sender,
            encryptedEvidenceCID: _encryptedEvidenceCID,
            encryptedReleaseTimestamp: FHE.asEuint32(_inEncryptedDeadline),
            isTriggered: false
        });
        
        emit VaultCreated(id);
        return id;
    }
    
    /**
     * @dev Whistleblower extends the deadline to prevent evidence release.
     */
    function checkIn(uint256 _vaultId, inEuint32 memory _inNewEncryptedDeadline) public {
        require(msg.sender == vaults[_vaultId].whistleblower, "Unauthorized");
        require(!vaults[_vaultId].isTriggered, "Vault already triggered");
        
        vaults[_vaultId].encryptedReleaseTimestamp = FHE.asEuint32(_inNewEncryptedDeadline);
        emit DeadMansSwitchCheckedIn(_vaultId);
    }
    
    /**
     * @dev Anyone can attempt to trigger the release. It only works if the encrypted deadline has passed.
     */
    function triggerRelease(uint256 _vaultId) public {
        Vault storage v = vaults[_vaultId];
        require(!v.isTriggered, "Already triggered");
        
        // FHE logic: is current block timestamp > encrypted release timestamp?
        euint32 currentTimestamp = FHE.asEuint32(uint32(block.timestamp));
        ebool shouldRelease = FHE.gt(currentTimestamp, v.encryptedReleaseTimestamp);
        
        // Only decrypt the boolean result
        bool result = FHE.decrypt(shouldRelease);
        
        if (result) {
            v.isTriggered = true;
            emit EvidenceReleased(_vaultId);
        }
    }
}
