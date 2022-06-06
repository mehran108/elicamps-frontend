import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/EliCamps/services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  public forgetPasswordForm: FormGroup;
  public loading = false;
   public defaultColDef;

  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
    public toaster: ToastrService) { }

  ngOnInit() {
    this.initializeForm();
  }
  public initializeForm = () => {
    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('')
    });
  }
  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      this.loading = true;
      this.authenticationService.forgotPassword(this.forgetPasswordForm.value).subscribe(res => {
        this.loading = false;
        if (res) {
          this.router.navigate(['/login']);
        }
      }, error => {
        this.toaster.error('Email is incorrect', 'Authentication Error');
        this.loading = false;
      });
    }
  }
}
