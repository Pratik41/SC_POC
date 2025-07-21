// components/node/node.component.ts
import { Component, Input, Output, EventEmitter, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Node } from '../models/workflow.model';
import { WorkflowService } from '../services/workflow.service';
import { MatDialog } from '@angular/material/dialog';
import { NodeConfigDialogComponent } from '../node-config-dialog/node-config-dialog.component';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {
  @Input() node!: Node;
  @Output() nodeMove = new EventEmitter<{ nodeId: string; position: { x: number; y: number } }>();
  @Output() connectionStart = new EventEmitter<{ nodeId: string; outputIndex: number; position: { x: number; y: number } }>();
  @Output() connectionEnd = new EventEmitter<{ nodeId: string; inputIndex: number }>();
  @Output() connectionCancel = new EventEmitter<void>();

  @ViewChild('nodeElement', { static: true }) nodeElement!: ElementRef<HTMLDivElement>;

  isDragging = false;
  isSelected = false;
  dragOffset = { x: 0, y: 0 };

  constructor(
    private workflowService: WorkflowService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.workflowService.selectedNode$.subscribe(selectedNode => {
      this.isSelected = selectedNode?.id === this.node.id;
    });
  }

  onMouseDown(event: MouseEvent): void {
    if (event.button === 0 && !event.ctrlKey) {
      this.isDragging = true;
      this.dragOffset = {
        x: event.clientX - this.node.position.x,
        y: event.clientY - this.node.position.y
      };
      this.workflowService.selectNode(this.node);
      event.stopPropagation();
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging) {
      const position = {
        x: event.clientX - this.dragOffset.x,
        y: event.clientY - this.dragOffset.y
      };
      this.nodeMove.emit({ nodeId: this.node.id, position });
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
  }

  onDoubleClick(): void {
    this.openConfigDialog();
  }

  openConfigDialog(): void {
    const dialogRef = this.dialog.open(NodeConfigDialogComponent, {
      width: '500px',
      data: { node: this.node }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.workflowService.updateNode(this.node.id, result);
      }
    });
  }

  deleteNode(): void {
    this.workflowService.deleteNode(this.node.id);
  }

  onOutputClick(event: MouseEvent, outputIndex: number): void {
    event.stopPropagation();
    const rect = this.nodeElement.nativeElement.getBoundingClientRect();
    const position = {
      x: this.node.position.x + 200,
      y: this.node.position.y + 30 + outputIndex * 30
    };
    this.connectionStart.emit({ nodeId: this.node.id, outputIndex, position });
  }

  onInputClick(event: MouseEvent, inputIndex: number): void {
    event.stopPropagation();
    this.connectionEnd.emit({ nodeId: this.node.id, inputIndex });
  }

  getInputArray(): any[] {
    return Array(this.node.inputs.length);
  }

  getOutputArray(): any[] {
    return Array(this.node.outputs.length);
  }
}