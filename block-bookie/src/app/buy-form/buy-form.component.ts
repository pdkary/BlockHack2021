import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MarketService} from '../market.service';



@Component({
  selector: 'app-buy-form',
  templateUrl: './buy-form.component.html',
  styleUrls: ['./buy-form.component.scss']
})
export class BuyFormComponent implements OnInit {
  cost = 0;
  changeCount =0;
  buyForm = this.FB.group({
    ID: new FormControl('',[Validators.required]),
    amount:new FormControl(0,[Validators.required,Validators.min(1)])
  })
  token_names = [];
  constructor(private FB:FormBuilder, private market: MarketService) {
    this.token_names = this.market.player_names;
   }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log(this.buyForm.controls['ID'].value);
    console.log(this.buyForm.controls['amount'].value);
    if(this.buyForm.valid){
      this.market.buy_token(this.buyForm.controls['ID'].value,this.buyForm.controls['amount'].value);
    }

  }
  async updateVals(){
    this.changeCount +=1;
    if(this.changeCount >= 2){
      this.cost = await this.market.get_token_value(this.buyForm.controls['ID'].value)*parseInt(this.buyForm.controls['amount'].value);
  
    }
  }
}