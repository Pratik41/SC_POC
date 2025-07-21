// components/node-config-dialog/node-config-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Node } from '../models/workflow.model';

@Component({
  selector: 'app-node-config-dialog',
  templateUrl: './node-config-dialog.component.html',
  styleUrls: ['./node-config-dialog.component.scss']
})
export class NodeConfigDialogComponent {
  configForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NodeConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { node: Node },
    private fb: FormBuilder
  ) {
    this.configForm = this.fb.group({
      name: [data.node.name, Validators.required],
      ...this.buildDynamicControls(data.node)
    });
  }

  buildDynamicControls(node: Node): any {
    const controls: any = {};
    
    // Add type-specific controls based on node type
    switch (node.type) {
      case 'http':
        controls.url = [node.data.url || '', Validators.required];
        controls.method = [node.data.method || 'GET'];
        controls.headers = [node.data.headers || ''];
        controls.body = [node.data.body || ''];
        break;
      case 'schedule':
        controls.cronExpression = [node.data.cronExpression || '0 * * * *'];
        controls.timezone = [node.data.timezone || 'UTC'];
        break;
      case 'set':
        controls.values = [node.data.values || ''];
        break;
      case 'if':
        controls.condition = [node.data.condition || ''];
        break;
      case 'code':
        controls.code = [node.data.code || '// Your code here\nreturn items;'];
        controls.language = [node.data.language || 'javascript'];
        break;
    }

    return controls;
  }

  save(): void {
    if (this.configForm.valid) {
      const formValue = this.configForm.value;
      const { name, ...data } = formValue;
      this.dialogRef.close({ name, data });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
