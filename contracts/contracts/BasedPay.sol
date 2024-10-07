// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BasedPay is Ownable {
    mapping (string => address) public uenToAddressMap;
    constructor() Ownable(msg.sender) {}

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
}
