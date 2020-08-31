import { Component, HostListener } from '@angular/core';
import { GiphyService } from './giphy.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'accelya';
  searchTerm: string;
  searchEndPoint: string;

  @HostListener('window:scroll')
  onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
      this.giphyService.next();
    }
  }

  constructor(public giphyService: GiphyService) {}

  search(endpoint) {
    this.giphyService.search(endpoint, this.searchTerm);
  }
}
