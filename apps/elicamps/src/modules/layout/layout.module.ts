import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { SharedModule } from '../shared/shared.module';
import { LayoutRoutes } from './layout.routing';
import { AppFooterComponent } from './sidebar/app.footer.component';
import { AppLayoutComponent } from './sidebar/app.layout.component';
import { AppMenuComponent } from './sidebar/app.menu.component';
import { AppMenuitemComponent } from './sidebar/app.menuitem.component';
import { AppSidebarComponent } from './sidebar/app.sidebar.component';
import { AppTopBarComponent } from './sidebar/app.topbar.component';
import { AppConfigModule } from '../layout/sidebar/config/config.module';

@NgModule({
  imports: [CommonModule, SharedModule, LayoutRoutes, AppConfigModule],
  declarations: [
    LayoutComponent,
    AppMenuitemComponent,
    AppTopBarComponent,
    AppFooterComponent,
    AppMenuComponent,
    AppSidebarComponent,
    AppLayoutComponent,
  ],
})
export class LayoutModule {}
