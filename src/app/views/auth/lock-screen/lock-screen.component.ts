import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoBoxComponent } from '@component/logo-box.component';

@Component({
  selector: 'app-lock-screen',
  imports: [LogoBoxComponent, RouterLink],
  templateUrl: './lock-screen.component.html',
  styles: ``,
})
export class LockScreenComponent {}
