// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "./SvgNft.sol";
import "../libraries/Storage.sol";


contract SvgNftFactory {

    address public immutable admin;

    
    mapping(address => address[]) public specialSvgNft;
    

    receive() external payable {}

    constructor() {
        admin = msg.sender;
    }

    function createSvgNft() external payable returns (address) {

        SvgNft newSvgNft = new SvgNft();

        specialSvgNft[msg.sender].push(address(newSvgNft));

        emit Storage.SvgNftFactoryCreated(msg.sender, address(newSvgNft));

        return address(newSvgNft);
    }
}