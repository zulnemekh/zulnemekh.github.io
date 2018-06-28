pragma solidity ^0.4.23;

contract Token {
    function transfer(address _to, uint _value) public returns (bool);
}

contract DayLucky {


    address public owner;
    Token umsToken; 
   

    uint private winnerCount;
    uint private winnerCountEth;
    uint public random_max;
    uint public totalFund;
    uint public totalFundETH;
    uint8 public lucky_number;
    uint public jackpot_lucky;
    uint won_price = 500;
    uint won_jackpot = 10000;
    uint won_priceETH = 50000000000000000;  // 0.05 eth
    uint won_jackpotETH = 1000000000000000000; // 1 eth
    mapping (address => uint) public winners;    
    address[] public winners_address;
    mapping (address => uint) public winners_eth;
    address[] public winners_eth_address;

    constructor(address _tokenAddress) public {
        umsToken = Token(_tokenAddress);
        owner = msg.sender;
        winnerCount = 0;
        winnerCountEth = 0;
        random_max = 6; // 1->6
        lucky_number = 2;
        totalFund=0;
        totalFundETH = 0;
        jackpot_lucky = 110;        
    }

     function () external payable {        
        uint amount = msg.value;
        address from = msg.sender;
        require(amount >= 10000000000000000); // 0.01 baga ETH-r orj irwel hohino manai orlogo
        
        totalFundETH +=amount;
        uint random = randomNumber(random_max);
        if(random == lucky_number && totalFundETH > won_priceETH){
            winnerCountEth+=1;
            from.transfer(won_priceETH);
            totalFundETH -= won_priceETH;
            winners_eth[from] = won_priceETH;
            winners_eth_address.push(from);
            emit Won(winnerCountEth, from, won_priceETH);
        }
        uint random_jackpot = randomNumber(jackpot_lucky);
        if(random_jackpot == lucky_number && totalFundETH > won_jackpotETH){
            winnerCountEth+=1;
            from.transfer(won_jackpotETH);
            totalFundETH -= won_jackpotETH;
            winners_eth[from] = won_jackpotETH;
            winners_eth_address.push(from);
            emit Won(winnerCountEth, from, won_jackpotETH);
        }
        
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function tokenFallback(address _from, uint _amount, bytes _data) external returns(bool) {
        
        require(msg.sender == address(umsToken));
        require(_amount >= 100);

        totalFund +=_amount;
        uint random = randomNumber(random_max);

        if(random == lucky_number && totalFund > won_price){            
            require(umsToken.transfer(_from, won_price));
            winnerCount+=1;
            totalFund -= won_price;
            winners[_from] = won_price;
            winners_address.push(_from);
            emit Won(winnerCount, _from, won_price);
        }
        uint random_jackpot = randomNumber(jackpot_lucky);
        if(random_jackpot == lucky_number && totalFund > won_jackpot){            
            require(umsToken.transfer(_from, won_jackpot));
            winnerCount+=1;
            totalFund -= won_jackpot;
            winners[_from] = won_jackpot;
            winners_address.push(_from);
            emit Won(winnerCount, _from, won_jackpot);
        }
        

        return true;
    }

    function getWinnerAddressLength() external view returns(uint) {
        return winners_address.length;
    }
    function getWinnerETHAddressLength() external view returns(uint) {
        return winners_eth_address.length;
    }
    function getWinnerCount() external view returns(uint) {
        return winnerCount;
    }
     function getWinnerCountETH() external view returns(uint) {
        return winnerCountEth;
    }
    
    function getTotalFund() external view returns(uint) {
        return totalFund;
    }
    
    function gettotalFundETH() external view returns(uint) {
        return totalFundETH;
    }
    
    function setRandom_max(uint max) external onlyOwner {
        random_max = max;
    }

    function setLucky(uint8 lucky) external {
        lucky_number = lucky;
    }
    
    function withdrawUMS() external onlyOwner {
        require(umsToken.transfer(owner, totalFund));
        totalFund = 0;
    }
    
    function withdrawETH() external onlyOwner {
        owner.transfer(address(this).balance);
        totalFundETH = 0;
    }
    
    // 1 -> max
    function randomNumber(uint max) private view returns (uint) {
       return uint(uint256(keccak256(block.timestamp, block.difficulty))%max+1);
    }

    event Won(uint indexed winnerCount, address indexed _winner, uint _price);

}