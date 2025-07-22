import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.css']
})
export class RightSidebarComponent implements OnChanges {
  @Input() selectedNode: any = null;
  @Output() updateNodeConfig = new EventEmitter<any>();
  @Output() triggerNode = new EventEmitter<any>();

  nodeConfig: any = {
    url: '',
    method: 'GET',
    headers: '',
    cronExpression: '0 * * * *',
    values: '',
    condition: '',
    code: '// Your code here\nreturn items;',
    language: 'javascript'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedNode'] && this.selectedNode) {
      // Merge existing node data with defaults
      this.nodeConfig = { 
        ...this.nodeConfig,
        ...(this.selectedNode.data || {})
      };
    }
  }

  handleSave(): void {
    if (this.selectedNode) {
      this.updateNodeConfig.emit({
        nodeId: this.selectedNode.id,
        config: this.nodeConfig
      });
    }
  }

  handleTrigger(): void {
    if (this.selectedNode) {
      this.triggerNode.emit(this.selectedNode);
    }
  }

 updateNodeName(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (this.selectedNode && target) {
    this.selectedNode.name = target.value;
  }
}

  // Add these methods for proper form handling
  onUrlChange(value: string): void {
    this.nodeConfig.url = value;
  }

  onMethodChange(value: string): void {
    this.nodeConfig.method = value;
  }

  onHeadersChange(value: string): void {
    this.nodeConfig.headers = value;
  }

  onCronExpressionChange(value: string): void {
    this.nodeConfig.cronExpression = value;
  }

  onValuesChange(value: string): void {
    this.nodeConfig.values = value;
  }

  onConditionChange(value: string): void {
    this.nodeConfig.condition = value;
  }

  onCodeChange(value: string): void {
    this.nodeConfig.code = value;
  }

  onLanguageChange(value: string): void {
    this.nodeConfig.language = value;
  }
}