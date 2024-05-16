import {
  Component,
  Input,
  OnChanges,
  OnInit,
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
  @Input() diameter: number = 44;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['loader']) {
      this.resetLoader();
    }
  }
  public resetLoader() {
    setTimeout(() => {
      this.loader = new Loader(false, false, false);
    }, 3500);
  }
}
