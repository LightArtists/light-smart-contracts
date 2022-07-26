// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.15;

import "../Packing.sol";

contract PackingMock {
    function addressUint96(address a, uint96 b) external pure returns (bytes32 retval) {
        return Packing.addressUint96(a, b);
    }
}
