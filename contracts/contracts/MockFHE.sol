// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library MockFHE {
    type ebool is uint256;
    type euint8 is uint256;
    type euint32 is uint256;
    type euint128 is uint256;

    function asEbool(uint256 value) internal pure returns (ebool) {
        return ebool.wrap(value > 0 ? 1 : 0);
    }

    function asEuint8(uint256 value) internal pure returns (euint8) {
        return euint8.wrap(value);
    }

    function asEuint32(uint256 value) internal pure returns (euint32) {
        return euint32.wrap(value);
    }

    function asEuint128(uint256 value) internal pure returns (euint128) {
        return euint128.wrap(value);
    }

    function add(euint32 a, euint32 b) internal pure returns (euint32) {
        return euint32.wrap(euint32.unwrap(a) + euint32.unwrap(b));
    }

    function mul(euint32 a, euint32 b) internal pure returns (euint32) {
        return euint32.wrap(euint32.unwrap(a) * euint32.unwrap(b));
    }

    function min(euint32 a, euint32 b) internal pure returns (euint32) {
        return euint32.unwrap(a) <= euint32.unwrap(b) ? a : b;
    }

    function max(euint32 a, euint32 b) internal pure returns (euint32) {
        return euint32.unwrap(a) >= euint32.unwrap(b) ? a : b;
    }

    function gte(euint32 a, euint32 b) internal pure returns (ebool) {
        return asEbool(euint32.unwrap(a) >= euint32.unwrap(b) ? 1 : 0);
    }

    function lte(euint32 a, euint32 b) internal pure returns (ebool) {
        return asEbool(euint32.unwrap(a) <= euint32.unwrap(b) ? 1 : 0);
    }

    function eq(euint8 a, euint8 b) internal pure returns (ebool) {
        return asEbool(euint8.unwrap(a) == euint8.unwrap(b) ? 1 : 0);
    }

    function eq(euint32 a, euint32 b) internal pure returns (ebool) {
        return asEbool(euint32.unwrap(a) == euint32.unwrap(b) ? 1 : 0);
    }

    function and(ebool a, ebool b) internal pure returns (ebool) {
        return asEbool((ebool.unwrap(a) == 1 && ebool.unwrap(b) == 1) ? 1 : 0);
    }

    function select(ebool condition, euint32 a, euint32 b) internal pure returns (euint32) {
        return ebool.unwrap(condition) == 1 ? a : b;
    }

    function allowThis(euint32) internal pure {}
    function allowThis(euint128) internal pure {}
    function allowThis(ebool) internal pure {}

    function allowSender(euint32) internal pure {}
    function allowSender(ebool) internal pure {}

    function allow(euint32, address) internal pure {}
    function allow(ebool, address) internal pure {}
    function allow(euint128, address) internal pure {}

    function sealoutput(euint32 value, bytes32) internal pure returns (bytes32) {
        return bytes32(euint32.unwrap(value));
    }
}
