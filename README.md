# Proof of Concept for IPFS with Smart contract

## Setup

As for any js-ipfs-api example, **you need a running IPFS daemon**, you learn how to do that here:

- [Spawn a go-ipfs daemon](https://ipfs.io/docs/getting-started/)
- [Spawn a js-ipfs daemon](https://github.com/ipfs/js-ipfs#usage)

**Note:** If you load your app from a different domain than the one the daemon is running (most probably), you will need to set up CORS, see https://github.com/ipfs/js-ipfs-api#cors to learn how to do that.

A quick (and dirty way to get it done) is:

```bash
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
```

## Run this example

Once the daemon is on, run the following commands within this folder:

```bash
> cd dapp
> npm install
> npm start
```

Now open your browser at `http://localhost:8888`

![imag](dapp/img/ipfs-example.gif)



## Check Contract Transactions

- Ropsten
    - contract address: [0x811ccfc7f5735de40b493a84688a1b2964d2900c](https://ropsten.etherscan.io/address/0x811ccfc7f5735de40b493a84688a1b2964d2900c)