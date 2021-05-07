import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

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

  constructor(private FB:FormBuilder) { }

  ngOnInit(): void {
  }

  onSubmit(){}
}