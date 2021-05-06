// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/utils/math/SafeMath.sol";
import "./PlayerToken.sol";

contract ValorantMarketPlace {
    using SafeMath for *;
    
    address owner;
    uint256 pot;
    mapping (string => uint256) tokenPrices;
    mapping (string => bool) tokenListings;
    mapping (string => PlayerToken) tokens;
    
    uint256 initial_supply = 10e6;
    uint8 decimals = 4;
    
    uint256 fee_percent = 5; //5% vig
    
    event Buy(address buyer, string playerID, uint256 price, uint256 num_tokens);
    event Sell(address seller, string playerID, uint256 price, uint256 num_tokens);
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    constructor() payable {
        owner = msg.sender;
        pot = msg.value;
    }
    
    function deposit() public payable onlyOwner {
        pot = SafeMath.add(pot,msg.value);
    }
    
    function withdraw() public payable onlyOwner {
        pot = SafeMath.sub(pot,msg.value);
    }
    
    function mintToken(string calldata playerID,string calldata tokenName,string calldata tokenSymbol, uint256 tokenPrice) public onlyOwner returns (bool) {
        require(!tokenListings[playerID]);
        tokens[playerID] = new PlayerToken(tokenName,tokenSymbol,initial_supply,decimals);
        tokenListings[playerID] = true;
        tokenPrices[playerID] = tokenPrice;
        return true;
    }
    
    function getPrice(string calldata playerID) public view returns (uint256) {
        require(tokenListings[playerID]);
        return tokenPrices[playerID];
    }
    
    function getTotalSupply(string calldata playerID) public view returns (uint256) {
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];
        return token.totalSupply();
    }
    
    function getTokenBalance(string calldata playerID, address user) public view returns (uint256) {
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];
        return token.balanceOf(user);
    }
    
    function getMyTokenBalance(string calldata playerID) public view returns (uint256){
        return this.getTokenBalance(playerID,msg.sender);
    }
    
    function updatePrice(string calldata playerID,uint256 price) public onlyOwner {
        require(tokenListings[playerID]);
        tokenPrices[playerID] = price;
    }
    
    function getTokenValue(string calldata playerID,address user) public view returns (uint256 value){
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];
        value = SafeMath.mul(token.balanceOf(user),tokenPrices[playerID]);
        return value;
    }
    
    function getMyTokenValue(string calldata playerID) public view returns (uint256 value){
        return this.getTokenValue(playerID,msg.sender);
    }
    
    function getPot() public view returns (uint256) {
        return pot;
    }
    
    function buyToken(string calldata playerID) external payable returns(bool) {
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];
        
        uint256 tokenPrice = tokenPrices[playerID];
        uint256 cost = SafeMath.mul((100+fee_percent),tokenPrice) / 100;
        
        uint256 tokens_received = msg.value/cost;
        
        //assert that mesage holds enough value for this transaction
        require(msg.value >= cost);
        bool success = true;
        //approve tokens for transfer from owner
        success = success && token.approve(msg.sender,tokens_received);
        //transfer tokens
        success = success && token.transferFrom(address(this),msg.sender,tokens_received);
        
        emit Buy(msg.sender,playerID,tokenPrice,tokens_received);
        
        //update pot
        pot = SafeMath.add(pot,msg.value);
        return success;
    }
    
    function approveSale(string calldata playerID, uint256 count) external payable returns (bool) {
       PlayerToken token = tokens[playerID];
       return token.approve_reverse(msg.sender,count);
    }
    
    function sellToken(string calldata playerID, uint256 count) external payable {
        PlayerToken token = tokens[playerID];
        
        uint256 tokenPrice = tokenPrices[playerID];
        uint256 cost = SafeMath.mul((100+fee_percent),tokenPrice) / 100;
        uint256 allowed = token.allowance(msg.sender,address(this));
        require(allowed >= count);
        //make sure user has tokens to sell
        uint256 tokenBalance = token.balanceOf(msg.sender);
        require(tokenBalance >= count);
        //make sure this wont bankrupt us
        uint256 payout = SafeMath.mul(cost,count);
        require(pot >= payout);
        
        //return tokens to the house, get money
        token.transferFrom(msg.sender,address(this),count);
        payable(msg.sender).transfer(payout);
        
        emit Sell(msg.sender,playerID,tokenPrice,count);
        
        //pot -= msg.value;
        pot = SafeMath.sub(pot,msg.value);
    }
}
