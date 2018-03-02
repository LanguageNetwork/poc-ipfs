'use strict'

var IPFS = require('ipfs-api');
var Web3 = require('web3');

var ipfs = IPFS();


function store () {
    var toStore = document.getElementById('source').files[0];
    var reader  = new FileReader();
    reader.readAsArrayBuffer(toStore);
    reader.onload = function(event) {
        console.log(event.target.result);
        ipfs.add(Buffer.from(reader.result), function (err, res) {
            if (err || !res) {
                alert('can\'t find ipfs node, install and run >ipfs daemon');
                return console.error('can\'t find ipfs node, install and run >ipfs daemon', err, res)
            }

            res.forEach(function (file) {
                console.log(file);
                if (file && file.hash) {
                    console.log('successfully stored', file.hash);
                    var price = Number(document.getElementById('price').value);
                    var name = document.getElementById('source').files[0].name;
                    alreadyCheckPromise(file.hash).then(function(){
                        Contract.addData(name, file.hash, Number(web3.toWei(price, 'ether')), function (err, res){
                            document.getElementById('contract-tx').innerHTML = '<a href="https://ropsten.etherscan.io/tx/'+res+'" target="_blank">'+res+'</a>';
                            console.log(res);
                            console.log(err);
                            console.log('promised');
                            display(file.hash);
                        });
                    });

                }
            })
        })
    };

}

var alreadyCheckPromise = function (hash) {
    return new Promise(function (resolve, reject) {
        Contract.getIpfs(hash, function (err, res){
            if (res == null){
                // return false;
                console.log('resolve');
                resolve("not already");
            }
            else {
                document.getElementById('ipfs-hash').innerText = hash;
                var link = "https://ipfs.io/ipfs/"+ hash;
                document.getElementById('content').innerText = link;
                document.getElementById('content').href = link;
                document.getElementById('content-image').src = link;
                document.getElementById('ipfs-owner').innerText = res[1];
                document.getElementById('ipfs-price').innerText = web3.fromWei(res[3], 'ether');
                alert('already exist file')
                console.log('false');

            }
        });
    });
};



function getDataCount() {
    Contract.dataCount( function (error, result) {
        if(!error) {
            document.getElementById('ipfs-count').innerText = result.toString();
        }
        else{
            console.log(error);
        }
    });
}

function display (hash) {
    ipfs.cat(hash, {buffer: true}, function (err, res) {
        if (err || !res) {

            alert('ipfs error');
            return console.error('ipfs cat error', err, res)

        }
        var link = "https://ipfs.io/ipfs/"+ hash;
        document.getElementById('content').innerText = link;
        document.getElementById('content').href = link;
        document.getElementById('content-image').src = link;

        document.getElementById('ipfs-owner').innerText = 'waiting for mining and to transaction be confirmed';
        document.getElementById('ipfs-price').innerText = 'waiting for mining and to transaction be confirmed';

        web3.eth.filter('latest', function(error, result){ // waiting mining for pending tx
            if (!error) {
                Contract.getIpfs(hash, function (err, res) {
                    // Contract.getData(res, function (err, res2){
                    console.log(hash);
                    console.log(res);
                    document.getElementById('ipfs-owner').innerText = res[1];
                    document.getElementById('ipfs-price').innerText = web3.fromWei(res[3], 'ether');
                    // })
                });
            } else {
                console.error(error)
            }
        });
        document.getElementById('ipfs-hash').innerText = hash;
    });
    getDataCount();
}


window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
        console.log('metamask');
        Contract = PocIpfsContract.at('0x811ccfc7f5735de40b493a84688a1b2964d2900c');
        console.log(Contract);
    } else {
        console.log('No web3? You should consider trying MetaMask!');
        document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example';

        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        console.log('local');
        console.log(web3);
    }

});



function watchBalance() {
    var coinbase = web3.eth.coinbase;
    document.getElementById('coinbase').innerText = 'coinbase: ' + coinbase;

    web3.eth.getBalance(coinbase, function(error, result){
        if(!error){
            var originalBalance = web3.fromWei(result, 'ether').toNumber();
            document.getElementById("current").innerText = 'current: ' + originalBalance.toString();
        }
        else{
            console.error(error);
        }
    });
    getDataCount();
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('store').onclick = store;
    document.getElementById('watch').onclick = watchBalance;
})
