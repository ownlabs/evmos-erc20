// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EvmosICO is ERC20, ERC20Burnable, Ownable {
    uint256 HARD_CAP;
    uint256 public mint_price = 0.0001 ether;
    uint256 public mint_qty = 10000 ether;
    constructor() ERC20("EvmosICO", "ETK") {
        _mint(msg.sender, 10000000 * 10 ** decimals());
        HARD_CAP = 500000000 * 10 ** decimals();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /*
        This method will allow anyone to mint the token.
    */
    function buyTokens()
        public
        payable
    {
        require(msg.value % mint_price == 0, 'EvmosICO, Amount must be a multiple of price');
        uint256 amount = msg.value / mint_price;
        require(amount >= 1, 'EvmosICO: Amount should be at least 1');
        uint256 reached = totalSupply() + mint_qty;
        require(reached <= HARD_CAP, "EvmosICO: Hard cap reached");
        uint256 bought_qty = mint_qty * amount;
        _mint(msg.sender, bought_qty);
    }
}