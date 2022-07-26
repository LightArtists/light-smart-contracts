// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.15;

import "../ThreeChiefOfficersWithRoyalties.sol";

contract ThreeChiefOfficersWithRoyaltiesMock is ThreeChiefOfficersWithRoyalties {
    constructor(address payable newFinancialOfficer, uint256 newRoyaltyFraction)
        ThreeChiefOfficersWithRoyalties(newFinancialOfficer, newRoyaltyFraction) {}

    function somethingOnlyOperatingOfficerCanDo() external onlyOperatingOfficer {
        // A thing was done
    }

    function donate() external payable {}
}
