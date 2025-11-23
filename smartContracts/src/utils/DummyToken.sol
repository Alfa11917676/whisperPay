// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DummyToken is ERC20{

    constructor() ERC20("USD_Stable", "USDS"){
        _mint(msg.sender, 100_000_000_000 ether);
    }
}
