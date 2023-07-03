import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import * as moment from 'moment'
import { ReportsComponent } from "../../pages/reports/reports.component";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @Output() rangeSelection: EventEmitter<any> = new EventEmitter<any>()
  week: any = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]
  firstDay: any = moment().isoWeekday(1).format('DD/MM/YYYY')
  lastDay: any = moment().isoWeekday(7).format('DD/MM/YYYY')
  today: any = moment().format("DD/MM/YYYY")
  month: string = moment().format('MM')
  year: number = new Date().getFullYear()
  monthSelect: any = [];
  dateSelect: any
  dateRange: any = []
  firstSelect: any = ''
  lastSelect: any = ''

  constructor(private reports: ReportsComponent){
    this.dateRange = this.reports.datesRange

  }

  ngOnInit(){
    this.getDaysfromDate(parseInt(this.month), this.year)
    // console.log(this.dateRange)
    // this.defaultWeek()
  }
  changeMonth(n:number){
    if(n > 0){
      const nextMonth = this.dateSelect.clone().add(1, 'month')
      this.getDaysfromDate(nextMonth.format('MM'), nextMonth.format("YYYY"))
    }else{
      const nextMonth = this.dateSelect.clone().subtract(1, 'month')
      this.getDaysfromDate(nextMonth.format('MM'), nextMonth.format("YYYY"))
    }
  }
  getDaysfromDate(month: number, year: number){
    const startDay = moment.utc(`${year}/${month}/01`, 'YYYYMMHH')
    const endDay = startDay.clone().endOf('month')
    this.dateSelect = endDay

    const diffdays = endDay.diff(startDay, 'days', true)
    const numberDays = Math.round(diffdays)

    const arrayDays = Object.keys([...Array(numberDays)]).map((a: any)=>{
      a = parseInt(a) + 1

      const dayObject =  moment(`${year}/${month}/${a}`, 'YYYY-MM-DD')
      return {
        name: dayObject.format('dddd'),
        value: a,
        fullDate: dayObject.format('YYYY/MM/DD'),
        indexWeek: dayObject.isoWeekday()
      }
    })
    this.monthSelect = arrayDays
  }
  selectRange(select: any){
    // console.log(select)
    if(this.firstSelect == '' && this.lastSelect == ''){
      this.firstSelect = select
      this.reports.datesRange.firstSelect = select
      this.reports.datesRange.lastSelect = select
    }
    else if(this.firstSelect !== '' && this.lastSelect == ''){
      this.lastSelect = select
      this.reports.datesRange.lastSelect = select
      if(this.getTime(this.firstSelect, select)){
        this.lastSelect = ''
        this.firstSelect = select
        this.reports.datesRange.firstSelect = select
        this.reports.datesRange.lastSelect = ''
      }
    }

    if(this.lastSelect !== '' && this.firstSelect !== ''){
      let selection = {
        firstSelect: this.firstSelect,
        lastSelect: this.lastSelect
      }
      console.log(selection)
      this.rangeSelection.emit(selection)
      this.reports.calendarHead = moment(new Date(this.firstSelect)).format('MMM, DD') + ' - ' + moment(new Date(this.lastSelect)).format('MMM, DD')
      this.reports.getEntries()
      this.lastSelect = ''
      this.firstSelect = ''
    }
  }
  getTime(date: any, selection: any){
    const firtsDate = new Date(date).getTime()
    const select = new Date(selection).getTime()
    if(firtsDate >= select){
      return true
    }else{
      return false
    }
  }
}
