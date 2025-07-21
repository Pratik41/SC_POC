import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-sidenav></app-sidenav>
      <div class="main-content">
        <app-workflow-toolbar></app-workflow-toolbar>
        <app-workflow-canvas></app-workflow-canvas>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      background-color: #1e1e1e;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  `]
})
export class AppComponent {}
