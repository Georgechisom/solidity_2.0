#Project Question: Build a Decentralized Turn-Based Strategy Game Contract

Design and implement a Solidity smart contract for a simple turn-based strategy game called "CryptoBattles" using Hardhat. The game should allow two players to join a match, take turns making moves, and determine a winner based on a simple health-point system. The contract should include the following features:

Player Registration: Allow two players to join a game by registering with a unique game ID. Each player starts with 100 health points.
Turn-Based Moves: Players take turns attacking or defending. An attack reduces the opponent's health by a random value between 5 and 20 (use a pseudo-random function). A defend action reduces damage taken in the next attack by 50%.
Game State Management: Track the game state (e.g., whose turn it is, players' health points, and whether the game is active or finished).
Winner Determination: Declare a winner when one player's health reaches 0 or below, and emit an event with the winner's address.
Game Reset: Allow the game to be reset after completion so new players can join the same game ID.
Basic Security: Prevent unauthorized players from making moves and ensure only registered players can interact with the game.

#Requirements:

Use Solidity for the smart contract logic.
Use Hardhat for the development environment, including testing and deployment scripts.
Write at least 5 test cases using Hardhat (with Mocha/Chai) to verify:

Successful player registration.
Correct turn alternation and health updates after attacks and defends.
Accurate winner determination.
Prevention of unauthorized moves.
Proper game reset functionality.

Include events for key actions (e.g., PlayerJoined, MoveMade, GameEnded).
Deploy the contract to a local Hardhat network and simulate a full game cycle in a test script.

Bonus Challenge:

Add a small entry fee (in ETH) for players to join a game, with the winner receiving the total pot minus a 5% fee sent to the contract owner.
Implement a simple Chainlink VRF integration (mock it in Hardhat tests) for truly random attack damage instead of pseudo-random logic.

#Guidance:

Use Hardhat's local development environment to compile, test, and deploy your contract.
Structure your contract with clear state variables, modifiers (e.g., for turn validation), and functions for each game action.
Refer to OpenZeppelin's libraries (e.g., Ownable) for access control if implementing the bonus fee feature.
For Chainlink VRF, check their documentation for mock setup in Hardhat (optional for bonus).

This project tests your understanding of Solidity (structs, mappings, events, modifiers) and Hardhat (testing, deployment, scripting) while creating an engaging gaming application. If you need a starter template or specific code snippets to begin, let me know, and I can provide them!
