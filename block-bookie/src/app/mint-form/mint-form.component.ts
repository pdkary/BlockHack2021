import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-mint-form',
  templateUrl: './mint-form.component.html',
  styleUrls: ['./mint-form.component.scss']
})
export class MintFormComponent implements OnInit {
  mintForm = this.FB.group({
    ID: new FormControl('',[Validators.required]),
    name: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9_]*$")]),
    symbol: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z0-9_]*$")]),
    price:new FormControl(0,[Validators.required,Validators.min(1)])
  })

  constructor(private FB:FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(){}
}