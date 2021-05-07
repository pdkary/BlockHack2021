import { Injectable, Inject } from '@angular/core';
import { WEB3 } from './web3';
import Web3 from 'web3';
import data from "../ValorantMarketPlace.json";
import { Address } from 'cluster';

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

  contract_hash = "0xbc58a9D1E9104e0B86a5566A647C23B0F31bbA2D";
  contract_abi: any = data;
  contract: any;

  accounts: string[];
  holdings: Map<string, Map<string,Holding>>;
  tokens: Map<string, Token>;

  pot: number = 0;
  minGas = 1e8;
  initial_supply = 1e5;

  constructor(@Inject(WEB3) private web3: Web3) {
    this.pull_accounts();
    this.load_contract();
    this.tokens = new Map();
    this.holdings = new Map();
  }

  async pull_accounts() {
    console.log(this.web3.currentProvider);
    this.accounts = await this.web3.eth.getAccounts();
  }

  async load_contract() {
    this.contract = await new this.web3.eth.Contract(this.contract_abi.abi, this.contract_hash);
  }

  async get_pot() {
    this.pot = await this.contract.methods.getPot().call();
  }

  async update_token_holdings() {
    let held_tokens = await this.contract.methods.getHeldTokens(this.accounts[0]).call();
    let current_holdings = this.holdings.get(this.accounts[0]);
    for (let i of held_tokens) {
      let num_tokens = await this.contract.methods.getTokenBalance(i, this.accounts[0]).call();
      let new_holding: Holding = {holder: this.accounts[0],playerID:i,holdings:num_tokens};
      current_holdings.set(i,new_holding);
    }
  }

  get_token_holdings(){
    return this.holdings.get(this.accounts[0]);
  }

  async get_token_value(playerID: string) {
    let price = await this.contract.methods.getPrice(playerID).call();
    return price;
  }

  async buy_token(playerID: string, amount: number) {
    let total_val = this.tokens.get(playerID).price * amount;
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

  async get_price(playerID: string): Promise<number> {
    let price = await this.contract.methods.getPrice(playerID).call();
    return price;
  }

  async update_price(playerID: string, new_price: number) {
    //this will require you to be an owner
    await this.contract.methods.updatePrice(playerID, new_price).send({ from: this.accounts[0], minGas: this.minGas });
    this.tokens.get(playerID).price = new_price;
  }

  async mint_token(playerID: string, name: string, symbol: string, price: number) {
    let success: boolean = await this.contract.methods.mintToken(playerID, name, symbol, price).send({ from: this.accounts[0], gasPrice: this.minGas });
    if (success) {
      let t = { "id": playerID, "name": name, "symbol": symbol, "price": price, "supply": this.initial_supply } as Token;
      this.tokens.set(playerID, t);
    }
  }
}
