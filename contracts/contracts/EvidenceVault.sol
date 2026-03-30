// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MockFHE.sol";

contract EvidenceVault is AccessControl, ReentrancyGuard {
    using MockFHE for *;

    bytes32 public constant COURT_ROLE = keccak256("COURT_ROLE");

    enum VaultState {
        SEALED,
        COURT_REVIEW
    }

    struct EncryptedEvidence {
        MockFHE.euint128 encIdentityHash;
        MockFHE.euint128 encContentHash;
        bytes32 ipfsCidHash;
        address submitter;
        VaultState state;
        address arbiter;
        bytes32 commitmentHash;
    }

    mapping(bytes32 => EncryptedEvidence) public vault;

    event EvidenceSealed(bytes32 indexed vaultId, bytes32 commitmentHash, uint256 timestamp);
    event CourtOrderExecuted(bytes32 indexed vaultId, address indexed arbiter, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(COURT_ROLE, admin);
    }

    function submitEvidence(
        MockFHE.euint128 encIdentityHash,
        MockFHE.euint128 encContentHash,
        bytes32 ipfsCidHash
    ) external nonReentrant returns (bytes32 vaultId) {
        bytes32 commitment = keccak256(abi.encode(ipfsCidHash, block.timestamp, msg.sender));
        vaultId = keccak256(abi.encode(msg.sender, block.timestamp, ipfsCidHash));

        vault[vaultId] = EncryptedEvidence({
            encIdentityHash: encIdentityHash,
            encContentHash: encContentHash,
            ipfsCidHash: ipfsCidHash,
            submitter: msg.sender,
            state: VaultState.SEALED,
            arbiter: address(0),
            commitmentHash: commitment
        });

        MockFHE.allowThis(encIdentityHash);
        MockFHE.allowThis(encContentHash);

        emit EvidenceSealed(vaultId, commitment, block.timestamp);
    }

    function executeCourtOrder(bytes32 vaultId, address arbiterAddress)
        external
        onlyRole(COURT_ROLE)
        nonReentrant
    {
        EncryptedEvidence storage entry = vault[vaultId];
        entry.state = VaultState.COURT_REVIEW;
        entry.arbiter = arbiterAddress;

        MockFHE.allow(entry.encIdentityHash, arbiterAddress);
        MockFHE.allow(entry.encContentHash, arbiterAddress);

        emit CourtOrderExecuted(vaultId, arbiterAddress, block.timestamp);
    }

    function getEvidencePlain(bytes32 vaultId)
        external
        view
        returns (bytes32 cidHash, uint8 state, bytes32 commitment, address submitter, address arbiter)
    {
        EncryptedEvidence storage entry = vault[vaultId];
        return (
            entry.ipfsCidHash,
            uint8(entry.state),
            entry.commitmentHash,
            entry.submitter,
            entry.arbiter
        );
    }
}
