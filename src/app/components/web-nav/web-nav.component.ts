import { Component } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-web-nav',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './web-nav.component.html',
  styleUrl: './web-nav.component.scss',
})
export class WebNavComponent {
  isActive: boolean = false;
  links: Array<any> = [
    {
      title: 'Home',
      href: '',
    },
    {
      title: 'Services',
      href: 'services',
    },
    {
      title: 'how it works',
      href: 'how-it-works',
    },
    {
      title: 'About us',
      href: 'about-us',
    },
    {
      title: 'contact us',
      href: 'contact-us',
    },
    {
      title: 'blog',
      href: 'blog'
    },
  ];
  constructor() {}

  toggleMenu() {
    this.isActive = !this.isActive;
  }
}
