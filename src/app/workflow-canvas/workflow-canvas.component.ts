// components/workflow-canvas/workflow-canvas.component.ts
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { Node, Connection } from '../models/workflow.model';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-workflow-canvas',
  templateUrl: './workflow-canvas.component.html',
  styleUrls: ['./workflow-canvas.component.scss']
})
export class WorkflowCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLDivElement>;
  
  nodes: Node[] = [];
  connections: Connection[] = [];
  scale = 1;
  translateX = 0;
  translateY = 0;
  showNodePanel = false;
  isPanning = false;
  startX = 0;
  startY = 0;
  
  private destroy$ = new Subject<void>();
  private connectionStart: { nodeId: string; outputIndex: number } | null = null;
  tempConnection: any = null;

  constructor(private workflowService: WorkflowService) {}

  ngOnInit(): void {
    this.workflowService.workflow$.pipe(takeUntil(this.destroy$)).subscribe(workflow => {
      this.nodes = workflow.nodes;
      this.connections = workflow.connections;
    });

    this.setupCanvasEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupCanvasEvents(): void {
    const canvas = this.canvas.nativeElement;

    // Mouse wheel for zoom
    fromEvent<WheelEvent>(canvas, 'wheel').pipe(takeUntil(this.destroy$)).subscribe(event => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.9 : 1.1;
      this.scale = Math.max(0.5, Math.min(2, this.scale * delta));
    });

    // Mouse events for panning
    fromEvent<MouseEvent>(canvas, 'mousedown').pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
        this.isPanning = true;
        this.startX = event.clientX - this.translateX;
        this.startY = event.clientY - this.translateY;
        event.preventDefault();
      }
    });

    fromEvent<MouseEvent>(document, 'mousemove').pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (this.isPanning) {
        this.translateX = event.clientX - this.startX;
        this.translateY = event.clientY - this.startY;
      }

      if (this.connectionStart && this.tempConnection) {
        const rect = canvas.getBoundingClientRect();
        this.tempConnection.endX = (event.clientX - rect.left - this.translateX) / this.scale;
        this.tempConnection.endY = (event.clientY - rect.top - this.translateY) / this.scale;
      }
    });

    fromEvent<MouseEvent>(document, 'mouseup').pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isPanning = false;
    });
  }

  get transform(): string {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  toggleNodePanel(): void {
    this.showNodePanel = !this.showNodePanel;
  }

  onNodeMove(event: { nodeId: string; position: { x: number; y: number } }): void {
    this.workflowService.updateNodePosition(event.nodeId, event.position);
  }

  onConnectionStart(event: { nodeId: string; outputIndex: number; position: { x: number; y: number } }): void {
    this.connectionStart = { nodeId: event.nodeId, outputIndex: event.outputIndex };
    this.tempConnection = {
      startX: event.position.x,
      startY: event.position.y,
      endX: event.position.x,
      endY: event.position.y
    };
  }

  onConnectionEnd(event: { nodeId: string; inputIndex: number }): void {
    if (this.connectionStart && this.connectionStart.nodeId !== event.nodeId) {
      this.workflowService.addConnection(
        this.connectionStart.nodeId,
        event.nodeId,
        this.connectionStart.outputIndex,
        event.inputIndex
      );
    }
    this.connectionStart = null;
    this.tempConnection = null;
  }

  onConnectionCancel(): void {
    this.connectionStart = null;
    this.tempConnection = null;
  }

  getConnectionPath(connection: Connection): string {
    const sourceNode = this.nodes.find(n => n.id === connection.source);
    const targetNode = this.nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) return '';

    const sourceX = sourceNode.position.x + 200;
    const sourceY = sourceNode.position.y + 30 + (connection.sourceOutput || 0) * 30;
    const targetX = targetNode.position.x;
    const targetY = targetNode.position.y + 30 + (connection.targetInput || 0) * 30;

    return this.createPath(sourceX, sourceY, targetX, targetY);
  }

  getTempConnectionPath(): string {
    if (!this.tempConnection) return '';
    return this.createPath(
      this.tempConnection.startX,
      this.tempConnection.startY,
      this.tempConnection.endX,
      this.tempConnection.endY
    );
  }

  private createPath(x1: number, y1: number, x2: number, y2: number): string {
    const distance = Math.abs(x2 - x1);
    const offset = Math.min(distance * 0.5, 100);
    return `M ${x1} ${y1} C ${x1 + offset} ${y1}, ${x2 - offset} ${y2}, ${x2} ${y2}`;
  }

  centerView(): void {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  zoomIn(): void {
    this.scale = Math.min(2, this.scale * 1.2);
  }

  zoomOut(): void {
    this.scale = Math.max(0.5, this.scale * 0.8);
  }

  fitToScreen(): void {
    if (this.nodes.length === 0) return;

    const padding = 50;
    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    this.nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + 200);
      maxY = Math.max(maxY, node.position.y + 100);
    });

    const width = maxX - minX;
    const height = maxY - minY;

    const scaleX = (canvasRect.width - padding * 2) / width;
    const scaleY = (canvasRect.height - padding * 2) / height;

    this.scale = Math.min(scaleX, scaleY, 1);
    this.translateX = (canvasRect.width - width * this.scale) / 2 - minX * this.scale;
    this.translateY = (canvasRect.height - height * this.scale) / 2 - minY * this.scale;
  }
}