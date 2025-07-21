import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent {
  @Input() selectedNode: any;
  @Output() updateNodeConfig = new EventEmitter<any>();
  @Output() triggerNode = new EventEmitter<any>();

  onSave() {
    this.updateNodeConfig.emit(this.selectedNode);
  }

  onTrigger() {
    this.triggerNode.emit(this.selectedNode);
  }
}
