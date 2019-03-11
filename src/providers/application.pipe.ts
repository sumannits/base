import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'limitTo'
})
export class TruncatePipe {
  transform(value: string, args: string): string {
    // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
    // let trail = args.length > 1 ? args[1] : '...';
    let limit = args ? parseInt(args, 10) : 10;
    let trail = '...';
    let result = '';
    if (value != null) {
      result = value.length > limit ? value.substring(0, limit) + trail : value;
    }

    return result;
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    //return super.transform(value, `${environment.DATE_FMT}`);
    return super.transform(value, args);
  }
}

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    //return super.transform(value, `${environment.DATE_TIME_FMT}`);
    return super.transform(value, args);
  }
}

@Pipe({
  name: 'orderBy', 
  pure: false
})

export class SortPipe implements PipeTransform {
  transform(records: Array<any>, args?: any): any {
      return records.sort(function(a, b){
          if(a[args.property] < b[args.property]){
              return -1 * args.direction;
          }
          else if( a[args.property] > b[args.property]){
              return 1 * args.direction;
          }
          else{
              return 0;
          }
      });
  };
}
