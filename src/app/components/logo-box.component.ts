import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-logo-box',
  imports: [CommonModule],
  template: `
    <div [class]="className">
      <a class="logo-dark">
        @if (size) {
          <div class="amc-title">AMC</div>
        } @else {
          <img src="assets/images/logo-dark.png" height="24" alt="logo dark" />
        }
      </a>

      <a class="logo-light">
        @if (size) {
          <div class="amc-title-dark">AMC</div>
        } @else {
          <img
            src="assets/images/logo-light.png"
            height="24"
            alt="logo light"
          />
        }
      </a>
    </div>
  `,
})
export class LogoBoxComponent {
  @Input() className: string = '';
  @Input() size: boolean = false;
}
