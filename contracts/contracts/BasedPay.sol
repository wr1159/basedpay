// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/Ownable.sol";

contract BasedPay is Ownable {
    mapping (string => address) public uenToAddressMap;
    constructor() Ownable(msg.sender) {}

    function addMapping(string memory uen, address addr) public {
        uenToAddressMap[uen] = addr;
    }

    function deleteMapping(string memory uen) public onlyOwner {
        delete uenToAddressMap[uen];
    }

    function getMapping(string memory uen) public view returns (address) {
        return uenToAddressMap[uen];
    }
}
