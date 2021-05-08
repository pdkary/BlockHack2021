// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/utils/math/SafeMath.sol";

contract PlayerToken {
    using SafeMath for *;
    
    address owner;
    
    string _name;
    string _symbol;
    
    uint256 _supply;
    uint8 _decimals;
    mapping(address => uint256) balances;
    
    event Transfer(address indexed from, address indexed to, uint tokens);
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    constructor(string memory name_, string memory symbol_,uint256 initial_supply,uint8 decimals_) payable{
        owner = msg.sender;
        _name = name_;
        _symbol = symbol_;
        _supply = initial_supply;
        _decimals = decimals_;
        balances[owner] = initial_supply;
    }
    
    function name() public view returns (string memory){
        return _name;
    }
    
    function symbol() public view returns (string memory){
        return _symbol;
    }
    function decimals() public view returns (uint8){
        return _decimals;
    }
    function totalSupply() public view returns (uint256){
        return _supply;
    }
    function balanceOf(address holder) public view returns (uint256 balance){
        balance = balances[holder];
        return balance;
    }
    function transfer(address _to, uint256 _value) public returns (bool success){
        return transferFrom(msg.sender,_to,_value);
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 balance = balances[_from];
        require(balance >= _value);
        balances[_from] = SafeMath.sub(balances[_from],_value);
        balances[_to] = SafeMath.add(balances[_to],_value);
        emit Transfer(_from,_to,_value);
        return true;
    }
}