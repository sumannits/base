import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingListPage } from './rating-list';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    RatingListPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingListPage),
    MomentModule
  ],
})
export class RatingListPageModule {}
