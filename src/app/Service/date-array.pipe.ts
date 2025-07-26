import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'dateArray' })
export class DateArrayPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: any[] | string | Date): string {
    let date: Date;
    
    if (Array.isArray(value)) {
      const [year, month, day, hours, minutes] = value;
      date = new Date(year, month - 1, day, hours, minutes);
    } else if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    return this.datePipe.transform(date, 'medium') || '';
  }
}