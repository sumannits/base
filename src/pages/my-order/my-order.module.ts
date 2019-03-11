import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderPage } from './my-order';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    MyOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderPage),
    MomentModule

  ],
})
export class MyOrderPageModule {}
