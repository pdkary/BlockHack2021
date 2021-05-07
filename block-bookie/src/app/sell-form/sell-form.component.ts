import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-sell-form',
  templateUrl: './sell-form.component.html',
  styleUrls: ['./sell-form.component.scss']
})
export class SellFormComponent implements OnInit {
  sellForm = this.FB.group({
    ID: new FormControl('',[Validators.required]),
    amount:new FormControl(0,[Validators.required,Validators.min(1)])
  })

  constructor(private FB:FormBuilder, private market:MarketService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.sellForm.valid){
      this.market.sell_token(this.sellForm.controls['ID'].value,this.sellForm.controls['amount'].value);
    }
  }
}