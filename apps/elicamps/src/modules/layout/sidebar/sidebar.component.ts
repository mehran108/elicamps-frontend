import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/dashboard' },
    { label: 'Accounts', icon: 'pi pi-fw pi-briefcase', routerLink: '/accounts' },
    { label: 'Transactions', icon: 'pi pi-fw pi-wallet', routerLink: '/transactions' },
    { label: 'Analytics', icon: 'pi pi-fw pi-chart-line', routerLink: '/analytics' },
    { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: '/settings' },
  ];

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
