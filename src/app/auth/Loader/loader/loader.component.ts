import { Component } from '@angular/core';
import { LoaderService } from '../../loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-overlay" *ngIf="isLoading$ | async">
      <div class="loader"></div>
    </div>
  `,
    styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
isLoading$ = this.loaderService.isLoading$;

  constructor(private loaderService: LoaderService) {}
}
