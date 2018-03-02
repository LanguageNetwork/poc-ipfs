var POC_IPFS = POC_IPFS.require("./poc-ipfs.sol");

module.exports = function(deployer) {
    deployer.deploy(POC_IPFS);
};