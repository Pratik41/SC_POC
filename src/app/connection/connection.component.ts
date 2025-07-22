import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-connection',
  template: `
    <svg class="connection-svg">
      <path [attr.d]="pathData" 
            class="connection-path"
            [class.active]="isActive">
      </path>
    </svg>
  `,
  styles: [`
    .connection-svg {
      position: absolute;
      pointer-events: none;
      overflow: visible;
    }
    .connection-path {
      fill: none;
      stroke: #666;
      stroke-width: 2;
    }
    .connection-path.active {
      stroke: #ff6d00;
    }
  `]
})
export class ConnectionComponent {
  @Input() pathData: string = '';
  @Input() isActive: boolean = false;
}