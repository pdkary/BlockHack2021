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
  constructor(public market: MarketService) { }

  async button_action() {
    this.accounts = await this.market.pull_accounts();
  }

  async ngOnInit(){
    this.button_action();
  }
}