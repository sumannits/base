import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TruncatePipe,SafePipe,SortPipe, DateFormatPipe, DateTimeFormatPipe} from "./application.pipe";

@NgModule({
  declarations: [
    TruncatePipe ,
    SafePipe,
    DateFormatPipe,
    DateTimeFormatPipe,
    SortPipe
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    TruncatePipe ,
    SafePipe,
    DateFormatPipe,
    DateTimeFormatPipe,
    SortPipe,
    //ShareModule
  ]
})
export class PipeModule {}
