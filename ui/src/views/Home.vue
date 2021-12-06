<template>
  <div class="tabs">
    <b-tabs v-model="activeTab" expanded :animated="false">
      <!-- Mint Tab -->
      <b-tab-item label="Mint">
        <h2 class="title is-size-4">Join the Evmos Token Sale</h2>
        Total supply is {{ totalSupply }}<br />
        You own {{ balance }} tokens.<br /><br />
        <b-button v-if="!pending" v-on:click="buy" type="is-primary"
          >Buy 10000 ETK for 0.0001 PHO</b-button
        >
        <div v-if="pending">
          Pending transaction hash is<br />{{ pending }}..
        </div>
      </b-tab-item>
      <!-- NFTs Tab -->
      <b-tab-item label="Manage" style="overflow: hidden">
        <h2 class="title is-size-4">Add it to Metamask</h2>
        Add token automatically to Metamask with one click.<br><br>
        <b-button v-on:click="add" type="is-primary"
          >ADD NOW</b-button
        >
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import Web3 from "web3";
const ABI = require("../abi.json");
const configs = require("../configs.json");
const BigNumber = require("big-number");
export default {
  props: ["account"],
  data() {
    return {
      activeTab: 0,
      web3: new Web3(window.ethereum),
      ABI: ABI,
      totalSupply: 0,
      balance: 0,
      decimals: 0,
      pending: "",
      owned: [],
    };
  },
  methods: {
    async buy() {
      const app = this;
      const contract = new app.web3.eth.Contract(
        app.ABI,
        configs.contract_address
      );
      try {
        await contract.methods
          .buyTokens()
          .send({
            from: app.account,
            value: app.web3.utils.toWei("0.0001", "ether"),
          })
          .on("transactionHash", (pending) => {
            app.pending = pending;
          });
        app.decimals = await contract.methods.decimals().call();
        const pow = BigNumber(10).pow(app.decimals);
        app.totalSupply = await contract.methods.totalSupply().call();
        app.totalSupply = BigNumber(app.totalSupply).divide(pow);
        app.balance = await contract.methods.balanceOf(app.account).call();
        app.balance = BigNumber(app.balance).divide(pow);
        app.pending = "";
      } catch (e) {
        alert(e.message);
      }
    },
    async add() {
      const app = this
      try {
       await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: configs.contract_address, // The address that the token is at.
              symbol: configs.symbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: configs.decimals, // The number of decimals in the token
              image: 'https://ico.ownlabs.dev/favicon32.png', // A string url of the token logo
            },
          },
        });
      } catch (e) {
        alert(e.message);
      }
    },
  },
  async mounted() {
    const app = this;
    const contract = new app.web3.eth.Contract(
      app.ABI,
      configs.contract_address
    );
    app.decimals = await contract.methods.decimals().call();
    const pow = BigNumber(10).pow(app.decimals);
    app.totalSupply = await contract.methods.totalSupply().call();
    app.totalSupply = BigNumber(app.totalSupply).divide(pow);
    app.balance = await contract.methods.balanceOf(app.account).call();
    app.balance = BigNumber(app.balance).divide(pow);
  },
};
</script>
<style>
svg {
  max-width: 100%;
}
</style>