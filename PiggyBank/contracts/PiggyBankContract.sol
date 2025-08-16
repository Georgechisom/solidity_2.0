// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { Data } from "../libraries/PiggyData.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PiggyBank {

    Data.Client[] public clientDetails;

    mapping(address => Data.Client) client_register;

    Data.SavingsAccount[] public all_savings;

    mapping(uint => Data.SavingsAccount) client_savings;

    mapping(address => uint[]) clientSavingIds;

    mapping(uint => address) clientIdToAddress;

    struct Clients {
        uint256 id;
        address clientAddress;
        string clientName;
        uint256 clientBalance;
    }


    address public admin;

    address private owner;

    uint public specialId;

    uint public count;


    constructor(address _admin, address _owner) {
        admin = _admin;
        owner = _owner;
    }

    modifier onlyRegisterAddress(address _client_address) {
        require(msg.sender == client_register[_client_address].clientAddress, "Only Registered Members can create savings account");
        _;
    }

    receive () external payable {}

    function register_with_bank(address _client_address, string memory _client_name) external {
        specialId++;

        Data.Client memory new_data = Data.Client({id: specialId, clientAddress: _client_address, clientName: _client_name, clientBalance: 0});

        clientDetails.push(new_data);

        client_register[_client_address] = new_data;
    }

    function create_multiple_savings_account(address _client_address, address _token, uint _lockTime) onlyRegisterAddress(_client_address) external {

        clientDetails;

        if (_client_address == address(0)) {
            revert Data.Invalid_Address();
        }
        specialId++;

        uint256 lockDuration = block.timestamp + _lockTime;



        for (uint256 i; i < clientDetails.length; i++) {
            if (_token == address(0)) {
                revert Data.Token_Cannot_Be_Zero();
            } else {
                Data.SavingsAccount memory new_savings = Data.SavingsAccount(specialId, _token, lockDuration, _lockTime, 0);

                all_savings.push(new_savings);

                clientSavingIds[_client_address].push(specialId);
                clientIdToAddress[specialId] = _client_address;
            }
        }
    }

    function deposit_eth_or_token(address _client_address, uint _saving_id, uint amount) onlyRegisterAddress(_client_address) external payable {
        if (_client_address == address(0)) {
            revert Data.Invalid_Address();
        } 

        bool isEth = all_savings[_saving_id].token == address(0);

        if (isEth) {
            if (amount <= 0) {
                revert Data.Amount_Must_Be_Greater_Than_Zero();
            }else if(_saving_id != all_savings[_saving_id].savings_id) {
                revert Data.Not_Authorized();
            } else {
                all_savings[_saving_id].balance = amount; 
                client_savings[_saving_id].balance = amount;
            }

        } else {
            if (!ERC20(all_savings[_saving_id].token).transferFrom(msg.sender, address(this), amount)) {
                revert Data.Transfer_Failed();
            }

            all_savings[_saving_id].balance = amount; 
            client_savings[_saving_id].balance = amount;
        }   
    }

    function withdraw_funds(address _client_address, uint _saving_id, uint amount) onlyRegisterAddress(_client_address) external {
        if (_client_address == address(0)) {
            revert Data.Invalid_Address();
        } else if (_client_address != all_savings[_saving_id].token) {
            revert Data.Not_Authorized();
        }

        
    }
}