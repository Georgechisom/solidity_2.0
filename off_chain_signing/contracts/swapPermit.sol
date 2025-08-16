// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "../interfaces/IERC20Permit.sol";
import "../interfaces/IUniswapRouter.sol";

contract swapPermit {
    
    address public constant UNISWAP_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    
    error InvalidSignature();
    error InsufficientAmount();
    error SwapFailed();
    error DeadlineExpired();

    
    event SwapExecuted( address indexed user, address tokenIn, uint256 amountIn, address tokenOut, uint256 amountOut );


    struct Permit {
        address owner;
        address spender;
        uint256 value;
        uint256 nonce;
        uint256 deadline;
    }


    // this is my function that executes a swap with an EIP-712 permit signature
    function swapWithPermit(
        address owner,
        address token,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 swapDeadline
    ) external returns (uint256[] memory amounts) {
        
        if (block.timestamp > deadline || block.timestamp > swapDeadline) {
            revert DeadlineExpired();
        }

        
        if (amountIn == 0 || amountIn > value) {
            revert InsufficientAmount();
        }

        
        try IERC20Permit(token).permit(owner, UNISWAP_ROUTER, value, deadline, v, r, s) {
        
        } catch {
            revert InvalidSignature();
        }


        if (!IERC20Permit(token).transferFrom(owner, address(this), amountIn)) {
            revert SwapFailed();
        }
        if (!IERC20Permit(token).approve(UNISWAP_ROUTER, amountIn)) {
            revert SwapFailed();
        }


        try
            IUniswapRouter(UNISWAP_ROUTER).swapExactTokensForTokens(
                amountIn,
                amountOutMin,
                path,
                to,
                swapDeadline
            )
        returns (uint256[] memory _amounts) {
            amounts = _amounts;
            emit SwapExecuted(
                owner,
                token,
                amountIn,
                path[path.length - 1],
                amounts[amounts.length - 1]
            );
        } catch {
            revert SwapFailed();
        }

        return amounts;
    }
}