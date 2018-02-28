'use strict'

var IPFS = require('ipfs-api')
var Web3 = require('web3')

var ipfs = IPFS()
// var web3 = Web3()

function store () {
    console.log('test');
    var toStore = document.getElementById('source').files[0]
    var reader  = new FileReader();
    reader.readAsArrayBuffer(toStore);
    reader.onload = function(event) {
        // The file's text will be printed here
        console.log(event.target.result)
        ipfs.add(Buffer.from(reader.result), function (err, res) {
            if (err || !res) {
                return console.error('ipfs add error', err, res)
            }

            res.forEach(function (file) {
                if (file && file.hash) {
                    console.log('successfully stored', file.hash)
                    display(file.hash)
                }
            })
        })
    };

}

function display (hash) {
    // buffer: true results in the returned result being a buffer rather than a stream
    ipfs.cat(hash, {buffer: true}, function (err, res) {
        if (err || !res) {
            return console.error('ipfs cat error', err, res)
        }

        document.getElementById('hash').innerText = hash

        document.getElementById('content').innerText = "https://ipfs.io/ipfs/"+ hash
        document.getElementById('content').href = "https://ipfs.io/ipfs/"+ hash
    })
}


window.addEventListener('load', function() {

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3 = new Web3(web3.currentProvider);
        console.log('metamask');
    } else {
        console.log('No web3? You should consider trying MetaMask!')
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        console.log('local');
    }

    // Now you can start your app & access web3 freely:
    // startApp()

})

// function getBalance (address) {
//     return new Promise (function (resolve, reject) {
//         web3.eth.getBalance(address, function (error, result) {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(result);
//             }
//         })
//     }


function watchBalance() {
    var coinbase = web3.eth.coinbase;
    // var coinbase = web3.eth.accounts[0];
    document.getElementById('coinbase').innerText = 'coinbase: ' + coinbase;

    web3.eth.getBalance(coinbase, function(error, result){
        if(!error){
            var originalBalance = web3.fromWei(result, 'ether').toNumber();
            document.getElementById("current").innerText = 'current: ' + originalBalance.toString();
        }
        else{
            console.error(error);
        }
    })

    // web3.eth.filter('latest').watch(function() {
    //     currentBalance =
    //     document.getElementById("current").innerText = 'current: ' + currentBalance;
    //     document.getElementById("diff").innerText = 'diff:    ' + (currentBalance - originalBalance);
    // });
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('store').onclick = store
    document.getElementById('watch').onclick = watchBalance
})

// window.onload = function() {
//     if (typeof web3 === 'undefined') {
//         document.getElementById('meta-mask-required').innerHTML = 'You need <a href="https://metamask.io/">MetaMask</a> browser plugin to run this example'
//     }
//     else {
//         delete web3;
//         web3 = new Web3(web3.currentProvider);
//     }
// }