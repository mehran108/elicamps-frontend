import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DOCUMENT } from '@angular/common';
import { AuthenticationService } from '../../../../services/authentication.service';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Keys } from 'apps/elicamps/src/common/lookup.enums';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public loading = false;
  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
    public toaster: ToastrService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.initializeForm();
  }
  public initializeForm = () => {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });
  };
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authenticationService.login(this.loginForm.value).subscribe(
        (res) => {
          this.loading = false;
          if (res) {
            localStorage.setItem(Keys.TOKEN_INFO, res.token);
            localStorage.setItem(Keys.USER_INFO, JSON.stringify(res));
            this.document.body.classList.remove('white-background');
            this.router.navigate(['registration/groups']);
          }
        },
        (error) => {
          this.toaster.error(
            'Email or password is incorrect',
            'Authentication Error'
          );
          this.loading = false;
        }
      );
    }
  }
}
