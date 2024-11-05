import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppMasterGuard } from '../../guards/app-master.guard';
const routes: Routes = [
  
  
  { path: 'invoice', loadChildren: () => import('../invoice/invoice.module').then(m => m.InvoiceModule)},
  { path: 'auth', loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule) },
  { path: '', canActivate: [AppMasterGuard], loadChildren: () => import('../layout/sidebar/app.layout.module').then(m => m.AppLayoutModule)},

];
@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
