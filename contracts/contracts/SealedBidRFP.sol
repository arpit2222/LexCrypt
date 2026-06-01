// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@fhenixprotocol/contracts/FHE.sol";
import "@fhenixprotocol/contracts/access/Permissioned.sol";

/**
 * @title SealedBidRFP
 * @dev Implements "Sealed-Bid Mechanics" requested in the Fhenix Buildathon prompt.
 * Lawyers submit encrypted bids (retainer fees) for a Citizen's legal case.
 * The contract finds the lowest bid without exposing the actual bid amounts.
 */
contract SealedBidRFP is Permissioned {
    
    struct RFP {
        address citizen;
        string caseSummary;
        bool isResolved;
        address winningLawyer;
    }
    
    struct Bid {
        address lawyer;
        euint32 encryptedFee;
    }
    
    mapping(uint256 => RFP) public rfps;
    // rfpId => list of bids
    mapping(uint256 => Bid[]) public rfpBids;
    
    uint256 public rfpCounter;
    
    event RFPCreated(uint256 indexed rfpId, address indexed citizen);
    event BidSubmitted(uint256 indexed rfpId, address indexed lawyer);
    event RFPResolved(uint256 indexed rfpId, address winningLawyer);
    
    function createRFP(string memory _caseSummary) public returns (uint256) {
        uint256 id = rfpCounter++;
        rfps[id] = RFP({
            citizen: msg.sender,
            caseSummary: _caseSummary,
            isResolved: false,
            winningLawyer: address(0)
        });
        emit RFPCreated(id, msg.sender);
        return id;
    }
    
    function submitBid(uint256 _rfpId, inEuint32 memory _inEncryptedFee) public {
        require(!rfps[_rfpId].isResolved, "RFP already resolved");
        
        rfpBids[_rfpId].push(Bid({
            lawyer: msg.sender,
            encryptedFee: FHE.asEuint32(_inEncryptedFee)
        }));
        
        emit BidSubmitted(_rfpId, msg.sender);
    }
    
    /**
     * @dev Evaluates all bids to find the lowest fee WITHOUT decrypting the amounts.
     * Uses FHE comparisons to determine the winner.
     */
    function resolveRFP(uint256 _rfpId) public {
        RFP storage rfp = rfps[_rfpId];
        require(msg.sender == rfp.citizen, "Only RFP creator can resolve");
        require(!rfp.isResolved, "Already resolved");
        require(rfpBids[_rfpId].length > 0, "No bids submitted");
        
        Bid[] storage bids = rfpBids[_rfpId];
        
        // Start with the first bid as the "lowest"
        euint32 lowestFee = bids[0].encryptedFee;
        address currentWinner = bids[0].lawyer;
        
        // FHE logic to find the minimum encrypted value
        for (uint i = 1; i < bids.length; i++) {
            // isCurrentBidLower = bids[i].encryptedFee < lowestFee
            ebool isCurrentBidLower = FHE.lt(bids[i].encryptedFee, lowestFee);
            
            // FHE.select returns param2 if param1 is true, else param3
            lowestFee = FHE.select(isCurrentBidLower, bids[i].encryptedFee, lowestFee);
            
            // Note: In a pure FHE implementation, tracking the address of the min value 
            // requires storing an array of encrypted booleans or using FHE.select on addresses.
            // For hackathon simplicity, we decrypt the boolean just to emit the winner.
            if (FHE.decrypt(isCurrentBidLower)) {
                currentWinner = bids[i].lawyer;
            }
        }
        
        rfp.winningLawyer = currentWinner;
        rfp.isResolved = true;
        
        emit RFPResolved(_rfpId, currentWinner);
    }
}
