import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Entries } from '../../models/Entries';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from 'src/app/models/Project.model';

@Component({
  selector: 'app-entries-panel',
  templateUrl: './entries-panel.component.html',
  styleUrls: ['./entries-panel.component.scss'],
})
export class EntriesPanelComponent implements OnChanges {
  @Output() start_entry: EventEmitter<any> = new EventEmitter<any>();
  @Output() end_entry: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentEntryId: any;
  @Input() start_time!: Date | null;
  @Input() entryCheck: boolean = false;
  @Input() entry: Entries = {
    status: 0,
    description: '',
    start_time: new Date(),
    end_time: new Date(),
    project_id: '',
    project: ''
  };
  showProjects: boolean = false;
  showMoreOption: boolean = false;
  currentTime: any;
  timer: string = '00:00:00';

  projects: any = [];

  constructor(
    private customDate: CustomDatePipe,
    private projectService: ProjectsService
  ) {}

  ngOnInit() {
    // console.log(navigator)
    this.getName();
    document.addEventListener('click', this.toggleMenu.bind(this));
    this.projectService.get().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entryCheck']) {
      if (this.entryCheck) this.startTimer(this.start_time);
      if (!this.entryCheck) this.stopTimer();
    }
  }
  addEntry() {
    const data = {
      description: this.entry.description,
      status: this.entry.status,
      start_time: new Date().toUTCString(),
      project_id: this.entry.project_id
    };
    this.start_entry.emit(data);
  }
  endCurrentEntry() {
    this.start_time = new Date();
    this.end_entry.emit(this.entry);
    this.entry.description = '';
    this.entry.project_id = '';
  }
  public getName() {
    const name = localStorage.getItem('name');
    return name;
  }
  public toggleMenu(event: any) {
    if (!(event.target as HTMLElement).closest('.options-btn')) {
      this.showMoreOption = false;
      this.showProjects = false;
    }
    if ((event.target as HTMLElement).closest('#project-options')) {
      this.showMoreOption = false;
      this.showProjects = !this.showProjects;
    }
    if ((event.target as HTMLElement).closest('#more-btn')) {
      this.showProjects = false;
      this.showMoreOption = !this.showMoreOption;
    }
  }

  public startTimer(start_time: any) {
    this.currentTime = setInterval(() => {
      this.timer = this.customDate.getTotalHours(start_time);
    }, 1000);
  }
  public stopTimer() {
    this.timer = '00:00:00';
    clearInterval(this.currentTime);
  }
  public setProject(project: Project){
    this.entry.project_id = project.id
    this.entry.project = project.name
  }
}
