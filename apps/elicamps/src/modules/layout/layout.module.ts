import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutRoutes } from './layout.routing';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LayoutRoutes
  ],
  declarations: [LayoutComponent,SidebarComponent]
})
export class LayoutModule { }
