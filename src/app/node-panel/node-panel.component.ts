// components/node-panel/node-panel.component.ts
import { Component, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { NodeType } from '../models/workflow.model';

@Component({
  selector: 'app-node-panel',
  templateUrl: './node-panel.component.html',
  styleUrls: ['./node-panel.component.scss']
})
export class NodePanelComponent {
  @Output() close = new EventEmitter<void>();
  @Input() canvasElement!: ElementRef<HTMLDivElement>;

  categories: string[] = [];
  nodesByCategory: { [key: string]: NodeType[] } = {};
  searchTerm = '';
  filteredNodes: NodeType[] = [];

  constructor(private workflowService: WorkflowService) {
    this.categories = this.workflowService.getNodeCategories();
    this.categories.forEach(category => {
      this.nodesByCategory[category] = this.workflowService.getNodesByCategory(category);
    });
    this.updateFilteredNodes();
  }

  onSearch(): void {
    this.updateFilteredNodes();
  }

  updateFilteredNodes(): void {
    if (!this.searchTerm) {
      this.filteredNodes = [];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredNodes = this.workflowService.nodeTypes.filter(node =>
      node.name.toLowerCase().includes(term) ||
      node.description.toLowerCase().includes(term)
    );
  }

  onDragStart(event: DragEvent, nodeType: NodeType): void {
    event.dataTransfer!.effectAllowed = 'copy';
    event.dataTransfer!.setData('nodeType', JSON.stringify(nodeType));
  }

  addNode(nodeType: NodeType): void {
    const rect = this.canvasElement.nativeElement.getBoundingClientRect();
    const position = {
      x: rect.width / 2 - 100,
      y: rect.height / 2 - 50
    };
    this.workflowService.addNode(nodeType, position);
    this.close.emit();
  }
}
