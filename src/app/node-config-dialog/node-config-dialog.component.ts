import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-node-config-dialog',
  templateUrl: './node-config-dialog.component.html',
  styleUrls: ['./node-config-dialog.component.css']
})
export class NodeConfigDialogComponent {
  @Input() isOpen: boolean = false; // Whether the modal is visible
  @Input() data: any = {}; // Data passed from the parent (node details)
  @Output() save = new EventEmitter<any>(); // Event emitter for save action
  @Output() cancel = new EventEmitter<void>(); // Event emitter for cancel action

  // Close the modal without saving
  onCancel() {
    this.cancel.emit();
  }

  // Emit saved data to parent
  onSave() {
    this.save.emit(this.data);
  }
}
