import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutes } from './auth.routing';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './features/login/login.component';
import { ForgetPasswordComponent } from './features/login/forget-password/forget-password.component';
import { UsersComponent } from './features/users/users.component';

@NgModule({
  imports: [CommonModule, SharedModule, AuthRoutes],
  declarations: [
    AuthComponent,
    UsersComponent,
    ForgetPasswordComponent,
    LoginComponent,
  ],
})
export class AuthModule {}
