import { Component, Inject, OnInit } from '@angular/core';
import { MarketService } from './market.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MarketService]
})
export class AppComponent {
  title = 'block-bookie';

  accounts: string[];
  tokens: string[];
  pot: number;
  constructor(public market: MarketService) { }

  async ngOnInit(){
    await this.market.load_contract();
    await this.market.pull_accounts();
    await this.market.get_pot();
    await this.market.get_token_holdings();
  }
}