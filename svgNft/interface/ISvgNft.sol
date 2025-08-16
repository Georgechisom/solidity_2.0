// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


interface ISvgNft {
    function mint() external payable returns (uint256);
    function token_url(uint256 tokenId) external view returns (string memory);
    function withdraw(uint256 tokenId) external;
}