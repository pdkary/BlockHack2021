import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss']
})
export class MintFormComponent implements OnInit {
  mintForm = this.FB.group({
    ID: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9_]*$")]),
    symbol: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9_]*$")]),
    price: new FormControl(0, [Validators.required, Validators.min(1)])
  })

  constructor(private FB: FormBuilder, private market: MarketService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.mintForm.valid) {
      this.market.mint_token(this.mintForm.controls['ID'].value, this.mintForm.controls['name'].value, this.mintForm.controls['symbol'].value, this.mintForm.controls['price'].value);
    }
  }
}