import { Component } from '@angular/core';
import { MarketplaceService } from './marketplace.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'block-bookie';

  constructor(private marketplace: MarketplaceService){}

  onclick() {
    this.marketplace.connectAccount();
  }
}
