import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { LocaleConfig, DaterangepickerComponent } from 'ngx-daterangepicker-material';



@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css'],
  host: {
    '(document:click)': 'onClickOutside($event)',
  },
})
export class DateRangePickerComponent implements OnInit,OnChanges {
  constructor() { }

  chosenDateRange: string;
  locale: LocaleConfig;
  DPshow: boolean = false;
  @ViewChild(DaterangepickerComponent,{static: false}) datePicker: DaterangepickerComponent;
  @Input() resetFlag: boolean = false;
  @Input() selectedFromDateAPI: string;
  @Input() selectedToDateAPI: string;
  @Output() selectedRange = new EventEmitter<any>();
  @Output() resetCompleted = new EventEmitter<any>();
  onloadButtonValue: any;
  radioModel:any;
  startDate: moment.Moment;
  endDate: moment.Moment;
  
  ngOnInit() {
    moment.locale('en');
    this.locale = {
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek(),
      format: 'DD-MMM-YYYY HH:mm:ss',
      separator: ' to '
    }
  } 

  ngOnChanges(changes: SimpleChanges) {
    // getting the dates from API
    if(this.selectedFromDateAPI != undefined && this.selectedToDateAPI!= undefined){
      this.startDate= moment(this.selectedFromDateAPI, "MM-DD-YYYY HH:mm:ss");
      this.endDate= moment(this.selectedToDateAPI, "MM-DD-YYYY HH:mm:ss");
    
      this.updateCalendar(this.startDate,this.endDate);      
      this.chosenDateRange = this.startDate.format("DD-MMM-YYYY HH:mm:ss") + " to " + this.endDate.format("DD-MMM-YYYY HH:mm:ss");
     
      // for defined terms
      let diff = this.endDate.diff(this.startDate, 'day');
      switch (Math.abs(diff)) {
        case 1: this.radioModel = "1";
          break;
        case 2: this.radioModel = "2";
          break;
        case 7: this.radioModel = "7";
          break;
        case 10: this.radioModel = "10";
          break;
        case 15: this.radioModel = "15";
          break;
       
        default: this.radioModel = "Custom";
      }
      this.onloadButtonValue = this.radioModel;
    }
    for (let propName in changes) {
      if (propName == "resetFlag") {
        let change = changes[propName];
        if (change.currentValue == true) {
          this.radioModel = '';
          this.chosenDateRange = "";
          this.updateCalendar(moment(),moment());
          this.datePicker.clear();
          this.resetCompleted.emit("ResetDone");
          this.onloadButtonValue = 'reset';
        }
      }
    }
  }
  choosedDate(e) {
    if(e.endDate != null && e.startDate != null){
      this.chosenDateRange = e.startDate.format("DD-MMM-YYYY HH:mm:ss") + " to " + e.endDate.format("DD-MMM-YYYY HH:mm:ss");
      let selectedRange = {startDate: e.startDate,endDate: e.endDate}
      this.selectedRange.emit(selectedRange);
      this.onloadButtonValue = 'reset';
      this.DPshow = false;
    }
  }
  toggleCal() {
    event.stopPropagation();
    this.DPshow = !this.DPshow
  }
  onClickOutside(e) {
    event.stopPropagation();
    if(this.DPshow === true){
      this.DPshow = !this.DPshow
    }
    if(this.onloadButtonValue!='Custom' && this.onloadButtonValue != 'reset'){
      this.radioModel = this.onloadButtonValue;
    }
  }
  // for defined terms
  rangeSelected(){
    event.stopPropagation();
    const endDate = moment();
    const startDate = moment().subtract(this.radioModel, 'day');
    if(this.radioModel !='Custom'){
      let selectedRange = {
        startDate:startDate,
        endDate:endDate
      }
      this.onloadButtonValue = this.radioModel;
      this.updateCalendar(startDate,endDate);
      this.chosenDateRange = startDate.format("DD-MMM-YYYY HH:mm:ss") + " to " + endDate.format("DD-MMM-YYYY HH:mm:ss");
      this.selectedRange.emit(selectedRange);
    }
  }
  updateCalendar(startDate:moment.Moment,endDate:moment.Moment){
    this.datePicker.setStartDate(startDate);
    this.datePicker.setEndDate(endDate);
    this.datePicker.updateView();
  }
}
