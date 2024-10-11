// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/swap-router-contracts/contracts/interfaces/ISwapRouter02.sol';
import '@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol';

contract BasedPay is Ownable {
    ISwapRouter02 public immutable swapRouter;

    struct Store {
        string uen;
        string name;
    }

    mapping(address => Store[]) public addressToStores;
    mapping(string => address) private uenToAddressMap;

    constructor(ISwapRouter02 _swapRouter) Ownable() {
        swapRouter = _swapRouter;
    }

    function registerStore(string memory uen, string memory name) public {
        require(bytes(uen).length > 0, "UEN cannot be empty");
        require(bytes(name).length > 0, "Store name cannot be empty");
        
        Store memory newStore = Store(uen, name);
        addressToStores[msg.sender].push(newStore);
        uenToAddressMap[uen] = msg.sender;
    }

    function deleteStore(string memory uen) public {
        require(uenToAddressMap[uen] == msg.sender, "Not authorized to delete this store");
        
        Store[] storage stores = addressToStores[msg.sender];
        for (uint i = 0; i < stores.length; i++) {
            if (keccak256(bytes(stores[i].uen)) == keccak256(bytes(uen))) {
                stores[i] = stores[stores.length - 1];
                stores.pop();
                break;
            }
        }
        
        delete uenToAddressMap[uen];
    }

    function updateStore(string memory uen, string memory newName) public {
        require(uenToAddressMap[uen] == msg.sender, "Not authorized to update this store");
        
        Store[] storage stores = addressToStores[msg.sender];
        for (uint i = 0; i < stores.length; i++) {
            if (keccak256(bytes(stores[i].uen)) == keccak256(bytes(uen))) {
                stores[i].name = newName;
                break;
            }
        }
    }

    function getStores(address merchant) public view returns (Store[] memory) {
        return addressToStores[merchant];
    }

    function getAddressFromUen(string memory uen) public view returns (address) {
        return uenToAddressMap[uen];
    }

    function payMerchant(address inputTokenAddress, address outputTokenAddress, string memory uen, uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {
        address merchant = uenToAddressMap[uen];
        require(merchant != address(0), "UEN not registered");

        if (inputTokenAddress == outputTokenAddress) {
            TransferHelper.safeTransferFrom(inputTokenAddress, msg.sender, merchant, amountOut);
            return amountOut;
        }

        TransferHelper.safeTransferFrom(inputTokenAddress, msg.sender, address(this), amountInMaximum);
        TransferHelper.safeApprove(inputTokenAddress, address(swapRouter), amountInMaximum);

        IV3SwapRouter.ExactOutputSingleParams memory params =
            IV3SwapRouter.ExactOutputSingleParams({
                tokenIn: inputTokenAddress,
                tokenOut: outputTokenAddress,
                fee: 500, // 0.05%
                recipient: merchant,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0 
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