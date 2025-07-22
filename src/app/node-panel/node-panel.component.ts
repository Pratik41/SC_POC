import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';

@Component({
  selector: 'app-node-panel',
  templateUrl: './node-panel.component.html',
  styleUrls: ['./node-panel.component.css']
})
export class NodePanelComponent {
  @Input() canvasElement!: ElementRef<HTMLDivElement>;  // Add this input
  @Output() close = new EventEmitter<void>();
  
  categories: string[] = [];
  nodesByCategory: { [key: string]: any[] } = {};
  searchTerm = '';
  filteredNodes: any[] = [];

  nodeTypes = [
    {
      type: 'trigger',
      name: 'Manual Trigger',
      category: 'Triggers',
      icon: 'play_arrow',
      color: '#ff6d00',
      description: 'Manually start the workflow'
    },
    {
      type: 'webhook',
      name: 'Webhook',
      category: 'Triggers',
      icon: 'webhook',
      color: '#ff6d00',
      description: 'Trigger workflow via webhook'
    },
    {
      type: 'schedule',
      name: 'Schedule',
      category: 'Triggers',
      icon: 'schedule',
      color: '#ff6d00',
      description: 'Run workflow on schedule'
    },
    {
      type: 'http',
      name: 'HTTP Request',
      category: 'Core',
      icon: 'http',
      color: '#2196f3',
      description: 'Make HTTP requests'
    },
    {
      type: 'set',
      name: 'Set',
      category: 'Core',
      icon: 'edit',
      color: '#4caf50',
      description: 'Set data values'
    },
    {
      type: 'if',
      name: 'IF',
      category: 'Core',
      icon: 'call_split',
      color: '#9c27b0',
      description: 'Conditional branching'
    },
    {
      type: 'code',
      name: 'Code',
      category: 'Core',
      icon: 'code',
      color: '#ff5722',
      description: 'Execute custom code'
    },
    {
      type: 'database',
      name: 'Database',
      category: 'Data',
      icon: 'storage',
      color: '#795548',
      description: 'Database operations'
    }
  ];

  constructor(private workflowService: WorkflowService) {
    this.initializeCategories();
  }

  ngOnInit(): void {
    this.initializeCategories();
  }

  initializeCategories(): void {
    // Get unique categories
    this.categories = [...new Set(this.nodeTypes.map(node => node.category))];
    
    // Group nodes by category
    this.categories.forEach(category => {
      this.nodesByCategory[category] = this.nodeTypes.filter(node => node.category === category);
    });
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
    this.filteredNodes = this.nodeTypes.filter(node =>
      node.name.toLowerCase().includes(term) ||
      node.description.toLowerCase().includes(term)
    );
  }

  onDragStart(event: DragEvent, nodeType: any): void {
    event.dataTransfer!.effectAllowed = 'copy';
    event.dataTransfer!.setData('nodeType', JSON.stringify(nodeType));
  }

  addNode(nodeType: any): void {
    // Calculate position based on canvas element if provided
    let position = { x: 400, y: 300 }; // Default position
    
    if (this.canvasElement && this.canvasElement.nativeElement) {
      const rect = this.canvasElement.nativeElement.getBoundingClientRect();
      position = {
        x: rect.width / 2 - 100,
        y: rect.height / 2 - 50
      };
    }
    
    this.workflowService.addNode(nodeType, position);
    this.close.emit();
  }
}