import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators, type UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router'
import pkg from '../../../../../package.json';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { login, loginFailure } from '@store/authentication/authentication.actions';
import { getUser } from '@store/authentication/authentication.selector';
import { AuthenticationService } from '@core/services/auth.service';

@Component({
  selector: 'app-signin',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  signInForm!: UntypedFormGroup

  public fb = inject(UntypedFormBuilder);
  public store = inject(Store)

  public sendForm = false;
  public loading = false;
  public versionapp: string = pkg.version;

  constructor(private toastr: ToastrService, 
    private authService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  get formValues() {
    return this.signInForm.controls;
  }

  login() {
    if (this.signInForm.valid) {
      this.sendForm = true;
      this.loading = true;
      const model = this.populeModelToLogin();

      this.store.dispatch(login(model));
      const session = this.authService.session;
      console.log(session, 'session');
      // this.store.select(getUser).subscribe(error => {
      //   console.log(error);
      //   if (error) {
      //     this.toastr.error("Usuário ou senha inválidos!", "Atenção!");
      //     this.loading = false;
      //   }
      // });
    } else {
      this.sendForm = true;
      this.toastr.error("Preencha todos os campos obrigatórios!", "Atenção!");
    }
  }


  populeModelToLogin(): any {
    const model: any = {};

    model.email = this.signInForm.controls["email"].value;
    model.password = this.signInForm.controls["password"].value;

    return model;
  }
}
