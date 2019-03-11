import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyOrderDetailPage } from './my-order-detail';
import { MomentModule } from 'angular2-moment';
@NgModule({
  declarations: [
    MyOrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MyOrderDetailPage),
    MomentModule
  ],
})
export class MyOrderDetailPageModule {}
