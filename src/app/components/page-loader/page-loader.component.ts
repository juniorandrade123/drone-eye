import { GlobalValuesService } from '@core/services/global.values.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.scss'],
  imports: [CommonModule]
})
export class PageLoaderComponent implements OnInit {
  public applicationPageLoading: boolean = true;
  constructor(private globals: GlobalValuesService) { }

  ngOnInit() {
    this.globals.applicationPageLoading.subscribe(loading => {
      setTimeout(() => {
        this.applicationPageLoading = loading;
      }, 100);
    });
  }
}
