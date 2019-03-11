import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailPage } from './order-detail';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    OrderDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailPage),
    MomentModule
  ],
})
export class OrderDetailPageModule {}
