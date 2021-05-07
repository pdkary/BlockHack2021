import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

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

  constructor(private FB:FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(){}
}
