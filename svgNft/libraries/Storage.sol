// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

library Storage {

    error Invalid_address();
    error Invalid_id();

    event minted(address _address, uint256 tokenId);
    event Withdrawn(address _address, uint256 tokenId);
    event SvgNftFactoryCreated(address creatorAddress, address contractAddress);
    
}