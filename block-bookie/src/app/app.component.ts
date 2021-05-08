import { ConditionalExpr } from '@angular/compiler';
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
    await this.market.update_all_data();
    console.log(this.market.token_names);
  }
}