// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract CryptoBattles is Ownable {
    struct Players {
        uint256 playerId;
        bool playerRegistered;
    }

    enum GameState { Active, currentTurn }

    struct Games {
        uint256 gameId;
        address playerAddress;
        uint256 playerHealthPoint;
        GameState game_state;
    }

    mapping (uint256 => Players) playerMap;

    mapping (address => uint256) playerHealth;

    mapping (address => uint256) playerAdd;

    mapping (uint256 => uint256) gamePot;

    mapping (uint256 => address[2]) gamePlayers;

    Players[] public PlayersData;

    Games[] public gameData;

    uint256 public playerCount;

    error No_Zero_Address();
    error Invalid_players();
    error Maximum_Limit_Exceeded();
    error Only_Owners_Address();
    error Can_Only_Register_Once();
    error Insufficient_funds();
    error Can_only_register_only();

    event PlayerJoined(uint256 gameId, address playerAddress, uint256 playerId);

    constructor() Ownable(msg.sender) {}

    modifier onlyPlayers(address _players) {
        if (_players == address(0)) {
            revert No_Zero_Address();
        } else if (_players != msg.sender) {
            revert Invalid_players();
        }

        _;
    }

    receive() external payable {}

    function register_player(uint256 _gameId) onlyPlayers(msg.sender) external payable {
        if (msg.sender == address(0)) {
            revert No_Zero_Address();
        }

        if (msg.value < 0.05 ether) {
            revert Insufficient_funds();
        }

        if (playerAdd[msg.sender] != 0) {
            revert Can_only_register_only();
        } else if (gamePlayers[_gameId][0] != address(0) && gamePlayers[_gameId][1] != address(0)) {
            revert Maximum_Limit_Exceeded();
        }

        playerCount++;

        
        if (PlayersData.length > 2) {
            revert Maximum_Limit_Exceeded();
        } else {
            Players memory new_players = Players(playerCount, true);

            PlayersData.push(new_players);

            playerAdd[msg.sender] = new_players.playerId;

            playerHealth[msg.sender] = 100;
        }

        if (gamePlayers[_gameId][0] == address(0)) {
            gamePlayers[_gameId][0] = msg.sender;
        } else {
            gamePlayers[_gameId][1] = msg.sender;
            Games memory newGame = Games(_gameId, address(0), 0, GameState.Active);
            gameData.push(newGame);
        }

        gamePot[_gameId] += msg.value;

        emit PlayerJoined(_gameId, msg.sender, playerAdd[msg.sender]);

    }
}