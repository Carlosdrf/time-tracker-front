import { Component, ChangeDetectorRef } from '@angular/core';
import { Entries } from 'src/app/models/Entries';
import { DashboardService } from "../../services/dashboard.service";
import { CustomDatePipe } from "../../services/custom-date.pipe";
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  entries: any = []
  regex =  /^\d+$/;

  entry: Entries = {
    status: 0,
    task: '',
    start_time: new Date(),
    end_time: new Date(),
  }
  entryCheck: string = '';
  currentEntryId: number = 0 

  constructor(private dashboardService: DashboardService, public customDate: CustomDatePipe, private cdRef: ChangeDetectorRef){}
  ngOnInit(){
    this.getName();
    this.getEntries();
    this.getEntryStatus()
  }
  getTotalHours(start: Date, end: Date){
    const [startformat, endformat] = [new Date(start), new Date(end)]
    const starts = startformat.getTime()
    const ends = endformat.getTime()
    const difference = ends - starts
    const hours = Math.floor(difference / 1000 / 60 / 60)
    const minutes = Math.floor((difference / 1000 / 60 )% 60)
    const seconds = Math.floor((difference/1000)%60)
    return this.padZero(hours) + ':' + this.padZero(minutes) + ':' + this.padZero(seconds)
  }
  private padZero(num: number): string{
    return num < 10 ? `0${num}` : `${num}`;
  }
  getEntries(){
    this.dashboardService.getEntries().subscribe(
      (v) => {
        this.entries = v;
      }
    )
  }
  getEntryStatus(){
    this.dashboardService.getEntryCheck().subscribe(
      (res) => {
        const status = res as Array<any>;
        if(status.length > 0){
          this.currentEntryId = status[0].id
          if(status[0].status === 0){
            this.entryCheck = 'started'
          }else{
            this.entryCheck = 'ended'
          }
        }else{
          this.entryCheck = 'no entries'
        }
      }
    )
  }
  addEntry(){
    delete this.entry.end_time;
    delete this.entry.start_time
    this.dashboardService.createEntry(this.entry).subscribe(
      (v) => {
        this.getEntries()
        this.getEntryStatus()
        this.entry.task = ''
      }
    )
  }
  endCurrentEntry(){
    this.dashboardService.closeCurrentEntry(this.currentEntryId).subscribe(
      (v) => {
        this.getEntries()
        this.getEntryStatus()
      }
    )
  }
  deleteEntry(id: number){
    this.dashboardService.deleteEntry(id).subscribe(
      (v) => {
        this.getEntries();
        this.getEntryStatus()
      }
    )
  }
  timeFormat(event: any, i: number){
    event.target.value = event.target.value.replace(/:/g, '')
  }
  updateTask(i: number, event: any){
    console.log(this.entries[i], event.target.value)
    this.dashboardService.updateEntry(this.entries[i].id, this.entries[i]).subscribe(
      (v)=>{
        console.log(v)
        this.getEntries();
        // this.getEntryStatus()
      }
    )

  }
  updateStart_time(date: Date, event: any, i: number){
    if(this.regex.test(event.target.value)){
      if(event.target.value.length == 3){
        event.target.value = 0+event.target.value
      }
      this.entry.start_time = new Date;
      const api_date = this.entries[i].start_time
      const time = this.customDate.transform(date, 'ss')
      const [newHour, newMinute] = [event.target.value.slice(0,2), event.target.value.slice(2)]
      const [seconds] = time.split(':')
      const dateformat = this.customDate.transform(api_date, 'YYYY-MM-DD')
      const [year, month, day] = dateformat.split('-')
      this.entry.start_time?.setFullYear(Number(year), Number(month), Number(day))
      this.entry.start_time?.setHours(Number(newHour), Number(newMinute), Number(seconds))
      this.entry.date = this.entries[i].date
      this.entry.end_time = this.entries[i].end_time
      this.entry.task = this.entries[i].description;
      this.dashboardService.updateEntry(this.entries[i].id, this.entry).subscribe(
        (v) => {
          this.getEntries();
        }
      )
    }else{
      this.getEntries();
    }
  }
  updateEnd_time(date: Date, event: any, i: number){
    if(this.regex.test(event.target.value)){
      if(event.target.value.length == 3){
        event.target.value = 0+event.target.value
      }
      this.entry.end_time = new Date()
      const api_date = this.entries[i].end_time
      const time = this.customDate.transform(date, 'ss')
      const [newHour, newMinute] = [event.target.value.slice(0,2), event.target.value.slice(2)]
      const [seconds] = time.split(':')
      const dateformat = this.customDate.transform(api_date, 'YYYY-MM-DD')
      const [year, month, day] = dateformat.split('-')
      this.entry.end_time?.setFullYear(Number(year), Number(month), Number(day))
      this.entry.end_time?.setHours(Number(newHour), Number(newMinute), Number(seconds))
      this.entry.date = this.entries[i].date
      this.entry.start_time = this.entries[i].start_time
      this.entry.task = this.entries[i].description;
      
      this.dashboardService.updateEntry(this.entries[i].id, this.entry).subscribe(
        (v) => {
          this.getEntries();
        }
      )
    }else{
      this.getEntries();
    }
  }
  transform(value: Date){
    return this.customDate.transform(value, 'HH:mm')
  }
  
  public getName(){
    const name = localStorage.getItem('name')
    return name;
  }

  public isToday(date: Date){
    const yesterday = this.customDate.transform(new Date(Date.now() - 24*60*60*1000), 'DD-MM-YYYY')
    const today = this.customDate.transform(new Date, 'DD-MM-YYYY')
    const compareDate = this.customDate.transform(date, 'DD-MM-YYYY')
    if(compareDate === today){
      return 'Today'
    }else if(compareDate === yesterday){
      return 'Yesterday'
    }else{
      return false;
    }
  }
}
