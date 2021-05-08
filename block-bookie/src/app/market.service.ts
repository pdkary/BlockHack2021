import { Injectable, Inject } from '@angular/core';
import { WEB3 } from './web3';
import Web3 from 'web3';
import data from "../ValorantMarketPlace.json";

class Token {
  public id: string;
  public name: string;
  public symbol: string;
  public price: number;
  public supply: number;
}

class Holding {
  public holder: string;
  public playerID: string;
  public holdings: number;
}

@Injectable({
  providedIn: 'root'
})
export class MarketService {


  /// Dear morning time mengling

  /// this is working
  // we should both be able to both make calls do onlyOwner functions
  //owner1: 0x29c067f2da454948be4ab6b559f51250ae7e7de2
  //owner2: 0x27a669e40cb2405938aeccf5f4bba8a92fe0b23b
  contract_hash = "0xA3C3D734baF3922d89a9dE00F59c9d022745D17E";
  contract_abi: any = data;
  contract: any;
  accounts: string[];
  token_names: string[];
  holdings: Map<string, Holding[]>;
  tokens: Map<string, Token>;

  user_holdings = [];

  pot: number = 0;
  minGas = 1e10;
  initial_supply = 1e5;

  constructor(@Inject(WEB3) private web3: Web3) {
    this.pull_accounts();
    this.load_contract().then( () => {
      this.load_all_tokens();
      this.update_token_holdings();
    });
  }

  async load_all_tokens() {
    this.token_names = await this.contract.methods.getAllTokens().call();
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

  async update_token_holdings() {
    let held_tokens = await this.contract.methods.getHeldTokens(this.accounts[0]).call();
    let current_holdings: Holding[] = this.holdings.get(this.accounts[0]);
    for (let i of held_tokens) {
      let num_tokens = await this.contract.methods.getTokenBalance(i, this.accounts[0]).call();
      let new_holding: Holding = {holder: this.accounts[0],playerID:i,holdings:num_tokens};
      if( current_holdings != undefined){
        current_holdings.push(new_holding);
      }else{
        let new_holdings: Holding[] = [new_holding];
        this.holdings.set(this.accounts[0],new_holdings);
      }
    }
    this.user_holdings = this.holdings.get(this.accounts[0]);
  }

  async get_token_value(playerID: string) {
    let price = await this.contract.methods.getPrice(playerID).call();
    return price;
  }

  async buy_token(playerID: string, amount: number) {
    let total_val = await this.contract.methods.getPrice(playerID).call();
    console.log(total_val);
    let succ = await this.contract.methods.buyToken(playerID).send({
      from: this.accounts[0],
      minGas: this.minGas,
      value:total_val
    });
    if(succ){
      this.update_token_holdings();
    }
  }

  async sell_token(playerID: string, amount: number) {
    //sell token takes it directly so thats easy peasy
    let succ = await this.contract.methods.sellToken(playerID,amount).send({
      from: this.accounts[0],
      minGas: this.minGas
    });
    if (succ){
      this.update_token_holdings();
    }
  }

  async update_price(playerID: string, new_price: number) {
    //this will require you to be an owner
    await this.contract.methods.updatePrice(playerID, new_price).send({ from: this.accounts[0], minGas: this.minGas });
    this.tokens.get(playerID).price = new_price;
  }
  
  async mint_token(playerID:string,name:string,symbol:string,price: number){
    this.contract.methods.mintToken(playerID,name, symbol, price).send({from: this.accounts[0],gasPrice: this.minGas});
  }
}
