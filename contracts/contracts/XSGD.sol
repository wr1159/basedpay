// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XSGD is ERC20, Ownable {
    constructor() ERC20("XSGD", "XSGD") Ownable(msg.sender) {
        _mint(msg.sender, 100000000000000000000000000);
    }
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}