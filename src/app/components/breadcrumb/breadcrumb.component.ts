import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styles: ``,
})
export class BreadcrumbComponent {
  @Input() showBtn = true;
  @Input() isCallMethod = false;
  @Input() title: string = ''
  @Input() subTitle: string = ''
  @Input() titleBtn: string = 'Adicionar';
  @Input() urlBtn = "";
  @Input() isBtnBack: boolean = false;

  @Output() callMethod = new EventEmitter<any>(); 

  sendMethod(){
    this.callMethod.emit();
  }
}
