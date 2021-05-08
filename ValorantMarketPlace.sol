// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/master/contracts/utils/math/SafeMath.sol";
import "./PlayerToken.sol";

contract ValorantMarketPlace {
    using SafeMath for *;

    address owner1;
    address owner2;

    uint256 pot;
    mapping(string => uint256) tokenPrices;
    mapping(string => bool) tokenListings;
    mapping(string => PlayerToken) tokens;
    mapping(address => string[]) heldTokens;
    string[] tokenIDs;

    uint256 initial_supply = 1e5;
    uint8 decimals = 0;

    uint256 fee_percent = 5; //5% vig

    event Buy(
        address buyer,
        string playerID,
        uint256 price,
        uint256 num_tokens
    );
    event Sell(
        address seller,
        string playerID,
        uint256 price,
        uint256 num_tokens
    );
    event Mint(
        string playerID,
        string tokenName,
        string tokenSymbol,
        uint256 tokenPrice
    );
    event Creation(address owner1, address owner2, uint256 pot);

    modifier onlyOwner {
        require(msg.sender == owner1 || msg.sender == owner2);
        _;
    }

    constructor(address second_owner) payable {
        owner1 = msg.sender;
        owner2 = second_owner;
        pot = msg.value;
        emit Creation(owner1, owner2, pot);
    }

    function deposit() public payable onlyOwner {
        pot = SafeMath.add(pot, msg.value);
    }

    function withdraw() public payable onlyOwner {
        pot = SafeMath.sub(pot, msg.value);
    }

    function mintToken(
        string calldata playerID,
        string calldata tokenName,
        string calldata tokenSymbol,
        uint256 tokenPrice
    ) public onlyOwner returns (bool) {
        require(!tokenListings[playerID]);
        tokens[playerID] = new PlayerToken(
            tokenName,
            tokenSymbol,
            initial_supply,
            decimals
        );
        tokenIDs.push(playerID);
        tokenListings[playerID] = true;
        tokenPrices[playerID] = tokenPrice;
        heldTokens[msg.sender].push(playerID);
        emit Mint(playerID, tokenName, tokenSymbol, tokenPrice);
        return true;
    }

    function getPrice(string calldata playerID) public view returns (uint256) {
        require(tokenListings[playerID]);
        return tokenPrices[playerID];
    }

    function getCost(string calldata playerID) public view returns (uint256) {
        return ((100 + fee_percent) * tokenPrices[playerID]) / 100;
    }

    function getAllTokens() public view returns (string[] memory) {
        return tokenIDs;
    }

    function getTotalSupply(string calldata playerID)
        public
        view
        returns (uint256)
    {
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];
        return token.totalSupply();
    }

    function getTokenBalance(string calldata playerID, address user)
        public
        view
        returns (uint256)
    {
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];
        return token.balanceOf(user);
    }

    function updatePrice(string calldata playerID, uint256 price)
        public
        onlyOwner
        returns (bool)
    {
        require(tokenListings[playerID]);
        tokenPrices[playerID] = price;
        return true;
    }

    function getTokenValue(string calldata playerID, address user)
        public
        view
        returns (uint256 value)
    {
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];
        value = SafeMath.mul(token.balanceOf(user), tokenPrices[playerID]);
        return value;
    }

    function getPot() public view returns (uint256) {
        return pot;
    }

    function getHeldTokens(address user) public view returns (string[] memory) {
        return heldTokens[user];
    }

    function buyToken(string calldata playerID)
        external
        payable
        returns (bool)
    {
        require(tokenListings[playerID]);
        PlayerToken token = tokens[playerID];

        uint256 tokenPrice = tokenPrices[playerID];
        uint256 multiplier = 100 + fee_percent;
        uint256 cost = SafeMath.mul(multiplier, tokenPrice) / 100;

        uint256 tokens_received = msg.value / cost;

        //assert that mesage holds enough value for this transaction
        require(msg.value >= cost);
        bool success = true;
        //transfer tokens
        success =
            success &&
            token.transferFrom(address(this), msg.sender, tokens_received);

        emit Buy(msg.sender, playerID, tokenPrice, tokens_received);
        heldTokens[msg.sender] = this.add_to_holdings(msg.sender, playerID);

        //update pot
        pot = SafeMath.add(pot, msg.value);
        return success;
    }

    function sellToken(string calldata playerID, uint256 count)
        external
        payable
        returns (bool)
    {
        PlayerToken token = tokens[playerID];

        uint256 tokenPrice = tokenPrices[playerID];
        uint256 multiplier = 100;
        uint256 cost =
            SafeMath.mul(multiplier, tokenPrice) / (100 + fee_percent);

        //make sure user has tokens to sell
        uint256 tokenBalance = token.balanceOf(msg.sender);
        require(tokenBalance >= count);
        //make sure this wont bankrupt us
        uint256 payout = SafeMath.mul(cost, count);
        require(pot >= payout);

        //return tokens to the house, get money
        token.transferFrom(msg.sender, address(this), count);
        payable(msg.sender).transfer(payout);
        if (tokenBalance - count == 0) {
            heldTokens[msg.sender] = remove_from_holdings(msg.sender, playerID);
        }

        emit Sell(msg.sender, playerID, tokenPrice, count);

        //pot -= msg.value;
        pot = SafeMath.sub(pot, msg.value);
        return true;
    }

    //--------------------------------------------UTILITY FUNCTIONS -------------------------------------------//
    function compare_strings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked(a)) ==
            keccak256(abi.encodePacked(b)));
    }

    function remove_from_holdings(address holder, string memory playerID)
        internal
        view
        returns (string[] memory)
    {
        string[] storage holds = heldTokens[holder];
        string[] memory new_holds = new string[](holds.length - 1);
        for (uint256 i = 0; i < holds.length; i++) {
            if (!compare_strings(holds[i], playerID)) {
                new_holds[i] = holds[i];
            }
        }
        return new_holds;
    }

    function add_to_holdings(address user, string calldata playerID)
        public
        returns (string[] memory)
    {
        string[] storage held_tokens = heldTokens[user];
        for (uint256 i = 0; i < held_tokens.length; i++) {
            if (compare_strings(held_tokens[i], playerID)) {
                return held_tokens;
            }
        }
        held_tokens.push(playerID);
        return held_tokens;
    }
}
