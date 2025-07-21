import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent {
  @Input() selectedNode: any;  // Receiving selectedNode from WorkflowComponent
  @Output() updateNodeConfig = new EventEmitter<any>();  // Emitting updated node data
  @Output() triggerNode = new EventEmitter<any>();  // Emitting triggered node data

  onSave() {
    this.updateNodeConfig.emit(this.selectedNode);  // Send updated node data back to WorkflowComponent
  }

  onTrigger() {
    this.triggerNode.emit(this.selectedNode);  // Trigger node action and send node data to WorkflowComponent
  }
}
