// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

library Data {

    struct Client {
        uint256 id;
        address clientAddress;
        string clientName;
        uint256 clientBalance;
    }

    struct SavingsAccount {
        uint savings_id;
        address token;
        uint256 lockPeriod;
        uint256 lockEnd;
        uint balance;
    }

    error Invalid_Address();
    error Token_Cannot_Be_Zero();
    error Not_Authorized();
    error Amount_Must_Be_Greater_Than_Zero();
    error Transfer_Failed();
}