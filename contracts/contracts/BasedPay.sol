// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/swap-router-contracts/contracts/interfaces/ISwapRouter02.sol';
import '@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol';
contract BasedPay is Ownable {
    ISwapRouter02 public immutable swapRouter;

    mapping (string => address) public uenToAddressMap;
    constructor(ISwapRouter02 _swapRouter) Ownable() {
        swapRouter = _swapRouter;
    }

    function register(string memory uen) public {
        uenToAddressMap[uen] = msg.sender;
    }

    function deleteMapping(string memory uen) public onlyOwner {
        delete uenToAddressMap[uen];
    }

    function updateMapping(string memory uen, address addr) public onlyOwner {
        uenToAddressMap[uen] = addr;
    }

    function getAddressFromUen(string memory uen) public view returns (address) {
        return uenToAddressMap[uen];
    }

    function swapExactOutputSingle(address inputTokenAddress, address outputTokenAddress, uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {
        // Transfer the specified amount of DAI to this contract.
        TransferHelper.safeTransferFrom(inputTokenAddress, msg.sender, address(this), amountInMaximum);

        // Approve the router to spend the specifed `amountInMaximum` of DAI.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        TransferHelper.safeApprove(inputTokenAddress, address(swapRouter), amountInMaximum);

        IV3SwapRouter.ExactOutputSingleParams memory params =
            IV3SwapRouter.ExactOutputSingleParams({
                tokenIn: inputTokenAddress,
                tokenOut: outputTokenAddress,
                fee: 500, //0.05%
                recipient: msg.sender,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96:0 
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(inputTokenAddress, address(swapRouter), 0);
            TransferHelper.safeTransfer(inputTokenAddress, msg.sender, amountInMaximum - amountIn);
        }
    }
}
