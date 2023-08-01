import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Loader } from 'src/app/app.models';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() loader: Loader = new Loader(false, false, false);
  // loader: Loader = new Loader(false, false, false)

  ngOnInit(): void {
    // console.log(this.loader);
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.loader)
  }

}
