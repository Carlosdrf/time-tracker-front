import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Loader } from 'src/app/app.models';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnChanges {
  constructor() {}
  @Input() loader: Loader = new Loader(false, false, false);
  @Input() message: string | null = null;
  // loader: Loader = new Loader(false, false, false)

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
}
