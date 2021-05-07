import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-update-price',
  templateUrl: './update-price.component.html',
  styleUrls: ['./update-price.component.scss']
})
export class UpdatePriceComponent implements OnInit {
  priceForm = this.FB.group({
    ID: new FormControl('',[Validators.required]),
    price:new FormControl(0,[Validators.required,Validators.min(1)])
  })

  constructor(private FB:FormBuilder, private market: MarketService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.priceForm.valid){
      this.market.update_price(this.priceForm.controls['ID'].value,this.priceForm.controls['price'].value);
    }
  }
}
