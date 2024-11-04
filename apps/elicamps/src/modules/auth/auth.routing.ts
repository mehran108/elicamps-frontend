import { Routes, RouterModule } from '@angular/router';
import { ForgetPasswordComponent } from './features/login/forget-password/forget-password.component';
import { LoginComponent } from './features/login/login.component';
import { UsersComponent } from './features/users/users.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'users', component: UsersComponent },
];

export const AuthRoutes = RouterModule.forChild(routes);
