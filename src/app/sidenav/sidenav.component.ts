// components/sidenav/sidenav.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  isExpanded = true;
  
  menuItems = [
    { icon: 'dashboard', label: 'Overview', route: '/overview' },
    { icon: 'folder', label: 'Projects', route: '/projects' },
    { icon: 'description', label: 'Templates', route: '/templates' },
    { icon: 'settings', label: 'Variables', route: '/variables' },
    { icon: 'history', label: 'Executions', route: '/executions' }
  ];

  toggleSidenav(): void {
    this.isExpanded = !this.isExpanded;
  }
}