// components/workflow-toolbar/workflow-toolbar.component.ts
import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { Workflow } from '../models/workflow.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workflow-toolbar',
  templateUrl: './workflow-toolbar.component.html',
  styleUrls: ['./workflow-toolbar.component.scss']
})
export class WorkflowToolbarComponent implements OnInit {
  workflow: Workflow | null = null;
  
  constructor(
    private workflowService: WorkflowService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.workflowService.workflow$.subscribe(workflow => {
      this.workflow = workflow;
    });
  }

  saveWorkflow(): void {
    // Implement save logic
    this.snackBar.open('Workflow saved', 'Close', { duration: 2000 });
  }

  executeWorkflow(): void {
    if (!this.workflow?.active) {
      this.snackBar.open('Please activate the workflow first', 'Close', { duration: 3000 });
      return;
    }
    this.workflowService.executeWorkflow();
    this.snackBar.open('Workflow execution started', 'Close', { duration: 2000 });
  }

  toggleActive(): void {
    this.workflowService.toggleWorkflowActive();
  }

  shareWorkflow(): void {
    // Implement share logic
    this.snackBar.open('Share feature coming soon', 'Close', { duration: 2000 });
  }
}
