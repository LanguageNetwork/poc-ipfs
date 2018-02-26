'use strict'

var IPFS = require('ipfs-api')

var ipfs = IPFS()

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

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('store').onclick = store
})
