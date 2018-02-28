pragma solidity ^0.4.19;

contract IPFS_POC {
    struct Ipfs {
        address owner;
        string fileInfo;
        string ipfsHash;
        uint256 priceWei;
        uint64 regDate;
        uint64 updateDate;
        uint sellCount;
    }

    Ipfs[] ipfsList;

    mapping (string => uint) ipfsMap;

    function IPFS_POC() public{
        string memory ipfsHash = "QmXWreZBUvVDgLKp5ysypAYuVmd8c6s157R2P4VsV665Ba";
        Ipfs memory ipfs = Ipfs({
            owner: msg.sender,
            fileInfo: "sample file",
            ipfsHash: ipfsHash,
            priceWei: 100000000000,
            regDate: uint64(now),
            updateDate: uint64(now),
            sellCount: 0
            });
        uint id = ipfsList.push(ipfs)-1;
        ipfsMap[ipfsHash] = id;  // it must be 0
    }

    event logging(uint a);
    event alreadyExist(string ipfsHash);

    function compareStrings (string a, string b) internal pure returns (bool){
        return keccak256(a) == keccak256(b);
    }

    modifier alreadyCheck(string ipfsHash) {
        if (ipfsMap[ipfsHash] != 0 || compareStrings(ipfsHash,ipfsList[0].ipfsHash)){
            alreadyExist(ipfsHash);
            revert();
        }
        _;
    }

    function getIpfsMap(string ipfsHash) public view returns (uint){
        return ipfsMap[ipfsHash];
    }

    function addData(string fileInfo, string ipfsHash, uint256 priceWei ) alreadyCheck(ipfsHash) public returns (uint){
        logging(ipfsMap[ipfsHash]);
        Ipfs memory ipfs = Ipfs({
            owner: msg.sender,
            fileInfo: fileInfo,
            ipfsHash: ipfsHash,
            priceWei: priceWei,
            regDate: uint64(now),
            updateDate: uint64(now),
            sellCount: 0
            });
        uint id = ipfsList.push(ipfs)-1;
        ipfsMap[ipfsHash] = id;
        return id;
    }

    modifier ownable(uint id){
        require(ipfsList[id].owner == msg.sender);
        _;
    }

    function getData(uint id) public view returns (address owner, string fileInfo, uint256 priceWei){
        return (ipfsList[id].owner, ipfsList[id].fileInfo, ipfsList[id].priceWei);
    }


    function getFullData(uint id) public view ownable(id) returns (address owner, string fileInfo, string ipfsHash, uint256 priceWei, uint64 regDate, uint64 updateDate, uint sellCount){
        return (ipfsList[id].owner, ipfsList[id].fileInfo, ipfsList[id].ipfsHash, ipfsList[id].priceWei, ipfsList[id].regDate, ipfsList[id].updateDate, ipfsList[id].sellCount);
    }

    function dataCount() public view returns (uint){
        return ipfsList.length;
    }

    function getTotalPrice() public view returns (uint){
        uint _dataCount = dataCount();
        uint index;
        uint256 totalPrice = 0;
        for (index = 0; index < _dataCount; index++){
            totalPrice = totalPrice + ipfsList[index].priceWei;
        }
        return totalPrice;
    }

    function buyData(uint id) public payable returns (bool){
        require(ipfsList[id].owner != msg.sender);
        require(ipfsList[id].priceWei == msg.value);
        ipfsList[id].owner.transfer(msg.value);
        ipfsList[id].owner = msg.sender;
        ipfsList[id].updateDate = uint64(now);
        ipfsList[id].sellCount+=1;
    }

}
