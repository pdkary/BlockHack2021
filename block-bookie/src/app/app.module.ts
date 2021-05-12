import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { BuyFormComponent } from './buy-form/buy-form.component';
import { MintFormComponent } from './mint-form/mint-form.component';
import { SellFormComponent } from './sell-form/sell-form.component';
import { UpdatePriceComponent } from './update-price/update-price.component';
import { CheckTokenComponent } from './check-token/check-token.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';

@NgModule({
  declarations: [
    AppComponent,
    BuyFormComponent,
    SellFormComponent,
    MintFormComponent,
    UpdatePriceComponent,
    CheckTokenComponent
  ],
  imports: [
    MatSelectModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatChipsModule,
    MatGridListModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }