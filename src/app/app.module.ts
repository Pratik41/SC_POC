import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NodeConfigDialogComponent } from './node-config-dialog/node-config-dialog.component';  // <-- Import the NodeConfigDialogComponent

// Import all your components
import { AppComponent } from './app.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { WorkflowCanvasComponent } from './workflow-canvas/workflow-canvas.component';
import { WorkflowToolbarComponent } from './workflow-toolbar/workflow-toolbar.component';
import { NodeComponent } from './node/node.component';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { NodePanelComponent } from './node-panel/node-panel.component';
import { ConnectionComponent } from './connection/connection.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkflowComponent,
    WorkflowCanvasComponent,
    WorkflowToolbarComponent,
    NodeComponent,
    RightSidebarComponent,
    NodePanelComponent,
    ConnectionComponent,
    NodeConfigDialogComponent 
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,           // Required for ngModel
    ReactiveFormsModule    // For reactive forms
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
