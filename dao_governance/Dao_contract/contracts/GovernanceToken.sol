// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title GovernanceToken
 * @dev A simple fixed-supply ERC20 token for governance.
 */
contract GovernanceToken is ERC20 {
    /**
     * @param initialSupply The total supply to mint (use 18 decimals like other ERC20s).
     */
    constructor(uint256 initialSupply, address treasury) ERC20("Governance Token", "GOV") {
        // Mint the full supply to the treasury
        _mint(treasury, initialSupply);
    }
}