import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../shared.module';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Output() onSearch: EventEmitter<any> = new EventEmitter<any>();
  @Output() onLoading: EventEmitter<any> = new EventEmitter<any>();
  @Input() searchForm: FormGroup = new FormGroup({
    searchField: new FormControl(''),
  });

  ngOnInit(): void {
    this.searchForEntries();
  }

  searchForEntries() {
    this.searchForm.valueChanges.subscribe(() => {
      this.onLoading.emit();
    });
    this.searchForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        this.onSearch.emit();
      });
  }
  public getName() {
    const name = localStorage.getItem('name');
    return name;
  }
}
