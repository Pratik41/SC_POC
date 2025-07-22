import { Component, OnInit } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';

@Component({
  selector: 'app-workflow-toolbar',
  templateUrl: './workflow-toolbar.component.html',
  styleUrls: ['./workflow-toolbar.component.css']
})
export class WorkflowToolbarComponent implements OnInit {
  workflow: any;
  workflowName: string = '';

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.workflowService.workflow$.subscribe(workflow => {
      this.workflow = workflow;
      this.workflowName = workflow?.name || '';
    });
  }

  updateWorkflowName(): void {
    if (this.workflow && this.workflowName) {
      this.workflowService.updateWorkflow({ ...this.workflow, name: this.workflowName });
    }
  }

  toggleActive(): void {
    this.workflowService.toggleWorkflowActive();
  }

  saveWorkflow(): void {
    console.log('Saving workflow...');
    // Add your save logic here
    alert('Workflow saved!');
  }

  executeWorkflow(): void {
    if (!this.workflow?.active) {
      alert('Please activate the workflow first');
      return;
    }
    console.log('Executing workflow...');
    // Add your execution logic here
  }

  shareWorkflow(): void {
    console.log('Share workflow');
    // Add share logic
  }

  viewHistory(): void {
    console.log('View history');
    // Add history logic
  }

  openSettings(): void {
    console.log('Open settings');
    // Add settings logic
  }
}