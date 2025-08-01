import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  NgbActiveOffcanvas,
  NgbDropdownModule,
  NgbOffcanvas,
  NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { changetheme } from '@store/layout/layout-action';
import { getLayoutColor } from '@store/layout/layout-selector';
import { SimplebarAngularModule } from 'simplebar-angular';
import { logout } from '@store/authentication/authentication.actions';
import { changesidebarsize } from '@store/layout/layout-action';
import { getSidebarsize } from '@store/layout/layout-selector';

@Component({
  selector: 'app-topbar',
  imports: [
    RouterModule,
    CommonModule,
    NgbOffcanvasModule,
    SimplebarAngularModule,
    NgbDropdownModule,
  ],
  templateUrl: './topbar.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NgbActiveOffcanvas],
})
export class TopbarComponent {
  @Input() title: string | undefined;
  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  router = inject(Router);
  store = inject(Store);
  offcanvasService = inject(NgbOffcanvas);

  notificationList = [
    {
      content:
        'As importações das imagens do processo ID #45 foram realizadas com sucesso.',
    },
    {
      content: 'As importações das imagens do processo ID #49 ocorrem erros. Clique aqui para visualizar detalhes.',
    },
  ];

  changeTheme() {
    const color = document.documentElement.getAttribute('data-bs-theme');
    if (color == 'light') {
      this.store.dispatch(changetheme({ color: 'dark' }));
    } else {
      this.store.dispatch(changetheme({ color: 'light' }));
    }
    this.store.select(getLayoutColor).subscribe((color) => {
      document.documentElement.setAttribute('data-bs-theme', color);
    });
  }

  changeSidebarSize() {
    let size = document.documentElement.getAttribute('data-menu-size');
    if (size != 'sm-hover-active') {
      size = 'sm-hover-active';
    } else {
      size = 'condensed';
    }
    this.store.dispatch(changesidebarsize({ size }));
    this.store.select(getSidebarsize).subscribe((size) => {
      document.documentElement.setAttribute('data-menu-size', size);
    });
  }

  logout() {
    this.store.dispatch(logout())
  }
}
