import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MarketService } from '../market.service';

@Component({
  selector: 'app-check-token',
  templateUrl: './check-token.component.html',
  styleUrls: ['./check-token.component.scss']
})
export class CheckTokenComponent implements OnInit {
  tokenForm = this.FB.group({
    ID: new FormControl('',[Validators.required]),
  })

  @Output()
  new_id: EventEmitter<string> = new EventEmitter<string>();

  constructor(private FB:FormBuilder, private market: MarketService) { }

  ngOnInit(): void {
  }

  onSubmit(){
    if(this.tokenForm.valid){
      let token_val = this.market.get_token_value(this.tokenForm.controls['ID'].value);
      this.new_id.emit(this.tokenForm.controls['ID'].value);
    }
  }
}
