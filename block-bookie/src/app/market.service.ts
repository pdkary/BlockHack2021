import { Injectable, Inject } from '@angular/core';
import { WEB3 } from './web3';
import Web3 from 'web3';
import data from "../ValorantMarketPlace.json";

@Injectable({
  providedIn: 'root'
})
export class MarketService {


  contract_hash = "0x1a2bFffdd723849dfa1205a01803a1533Aa49743";
  contract_abi: any = data;
  accounts: string[];
  holdings = [];
  pot: number;

  contract: any;
  constructor(@Inject(WEB3) private web3: Web3) {
    this.pull_accounts();
    this.load_contract();
  }

  async pull_accounts() {
    console.log(this.web3.currentProvider);
    this.accounts = await this.web3.eth.getAccounts();
  }

  async load_contract() {
    this.contract = await new this.web3.eth.Contract(this.contract_abi.abi,this.contract_hash);
  }

  async get_pot() {
    this.pot = await this.contract.methods.getPot().call();
  }

  async get_token_holdings(){
    let held_tokens = await this.contract.methods.getHeldTokens(this.accounts[0]).call();
    for(let i of held_tokens){
      let num_holdings = await this.contract.methods.getTokenBalance(i,this.accounts[0]).call();
      let price = await this.contract.methods.getPrice(i).call();
      this.holdings.push({name:i,holdings:num_holdings,value:price});
    }
  }

  async get_token_value() {

  }

  async buy_token(playerID: string,amount: number){
    //notice that this has a different input signature from the contract
    // this is because the contract figures out the amount based on the amount of eth transfered to it during the invocation
    // you will need to pass that value into the .send({}) when you call the method

  }

  async sell_token(playerID: string, amount: number){
    //sell token takes it directly so thats easy peasy
  }

  async get_price(playerID: string){

  }

  async update_price(playerID: string, new_price: number){
    //this will require you to be an owner
  }

  async mint_token(playerID:string,name:string,symbol:string,price: number){
    
  }
}
