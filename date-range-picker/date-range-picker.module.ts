import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DateRangePickerComponent } from './date-range-picker.component';
import { ButtonsModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [DateRangePickerComponent],
  exports: [DateRangePickerComponent],
  imports: [
    CommonModule,
    FormsModule, 
    NgxDaterangepickerMd.forRoot(),
    ButtonsModule.forRoot()
  ]
})
export class DateRangePickerModule { }
