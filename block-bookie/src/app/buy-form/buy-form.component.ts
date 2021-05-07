import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-buy-form',
  templateUrl: './buy-form.component.html',
  styleUrls: ['./buy-form.component.scss']
})
export class BuyFormComponent implements OnInit {
  buyForm = this.FB.group({
    ID: new FormControl('',[Validators.required]),
    amount:new FormControl(0,[Validators.required,Validators.min(1)])
  })

  constructor(private FB:FormBuilder, private market: MarketService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.buyForm.valid){
      this.market.buy_token(this.buyForm.controls['ID'].value,this.buyForm.controls['amount'].value);
    }
  }
}
