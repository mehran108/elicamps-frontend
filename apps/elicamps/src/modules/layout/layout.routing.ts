import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: 'common', loadChildren: () => import('../common/common.module').then(m => m.CommonModule)},
      { path: 'registration', loadChildren: () => import('../registration/registration.module').then(m => m.RegistrationModule)},
      { path: 'home', loadChildren: () => import('../analytics/analytics.module').then(m => m.AnalyticsModule)},
    ]
  }
];

export const LayoutRoutes = RouterModule.forChild(routes);
