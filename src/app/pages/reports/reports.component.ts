import { Component, ElementRef, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

import { DashboardService } from '../../services/dashboard.service';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { ReportsService } from '../../services/reports.service';
// import * as Chart from 'chart.js';
import * as filesaver from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  entries: any = [];
  isActive: boolean = false;
  datesSelection: any;
  datesRange: any = {};
  calendarHead: any;
  totalEntries: any = [];
  role = localStorage.getItem('role');
  params!: string;
  user: any;
  // chart init
  single: any;
  chart: any;
  ctx: any;
  canvas: any;
  data: any = [];
  labels: any = [];

  // chart bottom
  constructor(
    public dashboardservice: DashboardService,
    public customDate: CustomDatePipe,
    public reportsService: ReportsService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.defaultWeek();
    this.user = {
      id: localStorage.getItem('userid'),
      name: localStorage.getItem('user_name'),
    };
    this.getEntries();
    document.addEventListener('click', this.onClick.bind(this));
    this.canvas = document.getElementById('myChart') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    let delayed: boolean;
    if (this.ctx) {
      this.chart = new Chart(this.ctx, {
        type: 'bar',
        data: {
          datasets: [
            {
              label: 'Total Hours',
              // borderColor: 'blue',
              data: this.data,
              backgroundColor: '#92b46c',
            },
            // {
            //   label: 'just in case',
            // },
          ],
        },
        options: {
          animation: {
            onComplete: () => {
              delayed = true;
            },
            delay: (context) => {
              let delay = 0;
              if (
                context.type === 'data' &&
                context.mode === 'default' &&
                !delayed
              ) {
                delay = context.dataIndex * 300 + context.datasetIndex * 100;
              }
              return delay;
            },
          },
          responsive: true,
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem: any) {
                  const hours = Math.floor(tooltipItem.formattedValue as number);
                  const minutes = Math.floor(
                    ((tooltipItem.formattedValue as number) - hours) * 60
                  );
                  const seconds = Math.floor(
                    (((tooltipItem.formattedValue as number) - hours) * 60 - minutes) *
                      60
                  );
                  const total = `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                  return total;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              // ticks: {
              beginAtZero: true,
              // },
              stacked: true,
            },
          },
          maintainAspectRatio: false,
        },
      });
    }
  }

  toggleCalendar() {
    this.isActive = !this.isActive;
  }

  onClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('#content')) {
      this.isActive = false;
    }
  }

  getEntries() {
    if (this.user.id) {
      this.reportsService
        .getRange(this.datesRange, this.user.id)
        .subscribe((v) => {
          this.entries = v;
          this.arrangeEntries();
        });
    } else {
      this.reportsService.getRange(this.datesRange).subscribe((v) => {
        this.entries = v;
        this.arrangeEntries();
      });
    }
  }

  buttonReport() {
    if (this.user.id) {
      this.reportsService
        .getReport(this.datesRange, this.user.id)
        .subscribe((v) => {
          let filename;
          const [name, lastname] = this.user.name.split(' ');
          filename = `I-nimble_Report_${name}_${lastname}_${moment(
            new Date(this.datesRange.firstSelect)
          ).format('DD-MM-YYYY')}_${moment(
            new Date(this.datesRange.lastSelect)
          ).format('DD-MM-YYYY')}.xlsx`;

          filesaver.saveAs(v, filename);
        });
    } else {
      this.reportsService.getReport(this.datesRange).subscribe((v) => {
        let filename;
        filename = `I-nimble_${moment(
          new Date(this.datesRange.firstSelect)
        ).format('DD-MM-YYYY')}_${moment(
          new Date(this.datesRange.lastSelect)
        ).format('DD-MM-YYYY')}.xlsx`;
        filesaver.saveAs(v, filename);
      });
    }
  }

  defaultWeek() {
    const today = moment().format('DD/MM/YYYY');
    const firstday = moment().isoWeekday(1).format('DD/MM/YYYY');
    if (firstday == today) {
      this.getLastWeek();
    } else {
      const lastday = moment().isoWeekday(7).toLocaleString();
      this.datesRange = {
        firstSelect: moment(firstday, 'DD/MM/YYYY').format('YYYY/MM/DD'),
        // firstSelect: new Date(firstday).toISOString(),
        lastSelect: moment(new Date(lastday)).format('YYYY/MM/DD'),
        // lastSelect: new Date(lastday).toISOString()
      };
      this.calendarHead = 'This Week';
    }
    this.setDatesGroup(this.datesRange);
  }

  getLastWeek() {
    const now = new Date();
    const firstday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 7
    );
    const lastday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );
    this.datesRange = {
      firstSelect: moment(firstday).format('YYYY/MM/DD'),
      lastSelect: moment(lastday).format('YYYY/MM/DD'),
    };
    this.calendarHead = 'Last Week';
  }

  setDatesGroup(dateRange: any) {
    this.toggleCalendar();
    const startDate = new Date(dateRange.firstSelect);
    const endDate = new Date(dateRange.lastSelect);
    const dates = [];
    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      dates.push(new Date(day));
    }
    this.datesSelection = dates;
  }

  arrangeEntries() {
    const entries = this.entries;
    const totalentries = [];
    const totalhoursperday = entries.reduce((acc: any, curr: any) => {
      const date = moment(curr.start_time).format('YYYY-MM-DD');
      const start_time = new Date(curr.start_time).getTime();
      const end_time = new Date(curr.end_time).getTime();
      const duration = (end_time - start_time) / (1000 * 60 * 60);
      if (acc[date]) {
        acc[date] += duration;
      } else {
        acc[date] = duration;
      }
      return acc;
    }, {});
    console.log(totalhoursperday)
    for (const [date, totalhours] of Object.entries(totalhoursperday)) {
      const hours = Math.floor(totalhours as number);
      const minutes = Math.floor(((totalhours as number) - hours) * 60);
      const seconds = Math.floor(
        (((totalhours as number) - hours) * 60 - minutes) * 60
      );
      const total =
        this.padZero(hours) +
        ':' +
        this.padZero(minutes) +
        ':' +
        this.padZero(seconds);
      totalentries.push({ date, total, totalhours });
    }
    let displayData = this.datesSelection.map((date: any) => {
      return {
        date: moment(date).format('YYYY-MM-DD'),
        result: null,
        value: null,
      };
    });

    totalentries.forEach((result: any) => {
      let index = displayData.findIndex(
        (obj: any) =>
          new Date(obj.date).getTime() === new Date(result.date).getTime()
      );
      if (index !== -1) {
        displayData[index].result = result.total;
        displayData[index].value = result.totalhours;
      }
    });
    let i = 0;
    let single: any;
    this.labels = [];
    this.data = [];
    displayData.forEach((element: any) => {
      single = moment(element.date).format('ddd, MMM DD');
      this.labels.push(single);
      if (element.value === null) {
        single = 0;
      } else {
        single = element.value;
      }
      this.data.push(single);
      i++;
    });

    this.chart.data.datasets[0].data = this.data;
    this.chart.data.labels = this.labels;
    this.chart.update();

    // this.totalEntries = displayData;
  }
  testHours(start: any, end: any) {
    let total = new Date(end).getTime() - new Date(start).getTime();
    return total;
  }
  getTotalHours(start: Date, end: Date) {
    const [startformat, endformat] = [new Date(start), new Date(end)];
    const starts = startformat.getTime();
    const ends = endformat.getTime();
    const difference = ends - starts;
    const hours = Math.floor(difference / 1000 / 60 / 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    return (
      this.padZero(hours) +
      ':' +
      this.padZero(minutes) +
      ':' +
      this.padZero(seconds)
    );
  }
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
