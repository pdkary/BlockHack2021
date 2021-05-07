import { Injectable, Inject } from '@angular/core';
import { WEB3 } from './web3';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  accounts: string[];
  constructor(@Inject(WEB3) private web3: Web3) {}

  async pull_accounts() {
    if ('enable' in this.web3.currentProvider) {
      await this.web3.currentProvider.enable();
      console.log('Got Web3 Provider');
    }
    this.accounts = this.web3.eth.accounts;
    return this.accounts;
  }
}
