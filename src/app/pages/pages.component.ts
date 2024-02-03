import { Component, OnChanges, OnInit } from '@angular/core';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit{
  onAlert?: boolean = false
  message?: any
  alertElement?: any

  constructor(){}

  ngOnInit(): void {
    this.alertElement = document.getElementById('alert')
  }
  ngOnChanges(){
  }
  public setAlert(message: any){
    this.message = message
    this.onAlert = !this.onAlert

    this.alertElement.style.display = 'block'
    setTimeout(() => {
      this.alertElement.style.opacity = 1
    }, 300);
    setTimeout(() => {
      this.alertElement.style.opacity = 0
      setTimeout(() => {
        this.alertElement.style.display = 'none'
        this.onAlert = !this.onAlert
      }, 300);
    }, 2500);
  }
}
