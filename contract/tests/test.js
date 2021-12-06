const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
require('dotenv').config()
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const contract_name = argv._[0]
const NFT_CONTRACT_ABI = require('../abi.json')

async function main() {
    try {
        const configs = JSON.parse(fs.readFileSync('./configs/' + argv._ + '.json').toString())
        const provider = new HDWalletProvider(
            configs.owner_mnemonic,
            configs.provider
        );
        const web3Instance = new web3(provider);
        const contract = new web3Instance.eth.Contract(
            NFT_CONTRACT_ABI,
            configs.contract_address, { gasLimit: "10000000" }
        );
        console.log('Testing contract: ' + argv._)
        console.log('--')
        console.log('CONTRACT ADDRESS IS:', configs.contract_address)
        const owner = await contract.methods.owner().call();
        console.log('OWNER IS:', owner)
        console.log('Getting token details...')
        const supply = await contract.methods.totalSupply().call()
        console.log('Supply is', supply)
        const symbol = await contract.methods.symbol().call()
        console.log('Symbol is', symbol)
        const decimals = await contract.methods.decimals().call()
        console.log('Decimals are', decimals)
        const balance = await contract.methods.balanceOf(configs.owner_address).call()
        console.log('Balance is', balance)
        process.exit();
    } catch (e) {
        console.log(e.message)
        process.exit();
    }
}

if (argv._ !== undefined) {
    main();
} else {
    console.log('Provide a deployed contract first.')
}