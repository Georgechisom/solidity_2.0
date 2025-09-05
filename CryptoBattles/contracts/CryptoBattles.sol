// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract CryptoBattles is Ownable2Step, ReentrancyGuard {
    struct Players {
        uint256 playerId;
        bool playerRegistered;
    }

    enum GameState { Active, Not_Active }

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

    mapping(address => address) public playerOpponents;

    Players[] public PlayersData;

    Games[] public gameData;

    uint256 public playerCount;

    error No_Zero_Address();
    error Invalid_players();
    error Maximum_Limit_Exceeded();
    error Only_Owners_Address();
    error Can_Only_Register_Once();
    error Insufficient_funds();
    error only_register_players();
    error No_opponent_assigned();
    error Not_A_Registered_Player();
    error Player_health_is_0();

    event PlayerJoined(uint256 gameId, address playerAddress, uint256 playerId);
    event Attack(address indexed attacker, address indexed opponent, uint256 damage);
    event Defend(address playerAddress, string status);


    constructor() Ownable(msg.sender) {}

    modifier onlyPlayers(address _players) {
        if (_players == address(0)) {
            revert No_Zero_Address();
        } else if (_players != msg.sender) {
            revert Invalid_players();
        }

        if (playerAdd[msg.sender] != 0 || playerAdd[msg.sender] != 1) {
            revert Not_A_Registered_Player();
        } else if (playerHealth[_players] <= 0) {
            revert Player_health_is_0();
        }

        _;
    }

    receive() external payable {}

    function register_player(uint256 _gameId) external payable {
        if (msg.sender == address(0)) {
            revert No_Zero_Address();
        }

        if (msg.value < 0.03 ether) {
            revert Insufficient_funds();
        }

        if (playerAdd[msg.sender] != 0) {
            revert only_register_players();
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

    function attack_opponent (bool _attack) external onlyPlayers(msg.sender) {
        address opponent = playerOpponents[msg.sender];


        if (opponent == address(0)) {
            revert No_opponent_assigned();
        } else if (playerHealth[msg.sender] <= 0) {
            revert Player_health_is_0();
        }


        if (_attack) {
            playerHealth[opponent] -= 20;
            emit Attack(msg.sender, opponent, 20);
        } else {
            playerHealth[msg.sender] += 10;
        }


        
    }

    function defend_moves (bool _defend) external onlyPlayers(msg.sender) {
        
        address opponent = playerOpponents[msg.sender];


        if (opponent == address(0)) {
            revert No_opponent_assigned();
        } else if (playerHealth[msg.sender] <= 0) {
            revert Player_health_is_0();
        }


        if (_defend) {
            playerHealth[msg.sender];
            emit Defend(msg.sender, "Protected");
        } else {
            playerHealth[msg.sender] -= 20;
        }

        
    }
}