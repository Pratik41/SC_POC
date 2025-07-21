// services/workflow.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Node, Connection, Workflow, NodeType } from '../models/workflow.model';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private workflow = new BehaviorSubject<Workflow>({
    id: '1',
    name: 'My Workflow',
    nodes: [],
    connections: [],
    active: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  private selectedNode = new BehaviorSubject<Node | null>(null);
  private hoveredConnection = new BehaviorSubject<string | null>(null);

  workflow$ = this.workflow.asObservable();
  selectedNode$ = this.selectedNode.asObservable();
  hoveredConnection$ = this.hoveredConnection.asObservable();

  nodeTypes: NodeType[] = [
    {
      type: 'trigger',
      name: 'Manual Trigger',
      category: 'Triggers',
      icon: 'play_arrow',
      color: '#ff6d00',
      inputs: 0,
      outputs: 1,
      description: 'Manually start the workflow'
    },
    {
      type: 'webhook',
      name: 'Webhook',
      category: 'Triggers',
      icon: 'webhook',
      color: '#ff6d00',
      inputs: 0,
      outputs: 1,
      description: 'Trigger workflow via webhook'
    },
    {
      type: 'schedule',
      name: 'Schedule',
      category: 'Triggers',
      icon: 'schedule',
      color: '#ff6d00',
      inputs: 0,
      outputs: 1,
      description: 'Run workflow on schedule'
    },
    {
      type: 'http',
      name: 'HTTP Request',
      category: 'Core',
      icon: 'http',
      color: '#2196f3',
      inputs: 1,
      outputs: 1,
      description: 'Make HTTP requests'
    },
    {
      type: 'set',
      name: 'Set',
      category: 'Core',
      icon: 'edit',
      color: '#4caf50',
      inputs: 1,
      outputs: 1,
      description: 'Set data values'
    },
    {
      type: 'if',
      name: 'IF',
      category: 'Core',
      icon: 'call_split',
      color: '#9c27b0',
      inputs: 1,
      outputs: 2,
      description: 'Conditional branching'
    },
    {
      type: 'merge',
      name: 'Merge',
      category: 'Core',
      icon: 'merge_type',
      color: '#607d8b',
      inputs: 2,
      outputs: 1,
      description: 'Merge multiple inputs'
    },
    {
      type: 'code',
      name: 'Code',
      category: 'Core',
      icon: 'code',
      color: '#ff5722',
      inputs: 1,
      outputs: 1,
      description: 'Execute custom code'
    },
    {
      type: 'database',
      name: 'Database',
      category: 'Data',
      icon: 'storage',
      color: '#795548',
      inputs: 1,
      outputs: 1,
      description: 'Database operations'
    },
    {
      type: 'email',
      name: 'Email',
      category: 'Communication',
      icon: 'email',
      color: '#00bcd4',
      inputs: 1,
      outputs: 1,
      description: 'Send emails'
    },
    {
      type: 'slack',
      name: 'Slack',
      category: 'Communication',
      icon: 'chat',
      color: '#4a154b',
      inputs: 1,
      outputs: 1,
      description: 'Send Slack messages'
    }
  ];

  getNodeCategories(): string[] {
    return [...new Set(this.nodeTypes.map(node => node.category))];
  }

  getNodesByCategory(category: string): NodeType[] {
    return this.nodeTypes.filter(node => node.category === category);
  }

  addNode(nodeType: NodeType, position: { x: number; y: number }): void {
    const currentWorkflow = this.workflow.value;
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: nodeType.type,
      name: nodeType.name,
      position,
      data: {},
      inputs: Array(nodeType.inputs).fill(null),
      outputs: Array(nodeType.outputs).fill(null),
      icon: nodeType.icon,
      color: nodeType.color
    };

    this.workflow.next({
      ...currentWorkflow,
      nodes: [...currentWorkflow.nodes, newNode],
      updatedAt: new Date()
    });
  }

  updateNodePosition(nodeId: string, position: { x: number; y: number }): void {
    const currentWorkflow = this.workflow.value;
    const nodes = currentWorkflow.nodes.map(node =>
      node.id === nodeId ? { ...node, position } : node
    );

    this.workflow.next({
      ...currentWorkflow,
      nodes,
      updatedAt: new Date()
    });
  }

  updateNode(nodeId: string, updates: Partial<Node>): void {
    const currentWorkflow = this.workflow.value;
    const nodes = currentWorkflow.nodes.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    );

    this.workflow.next({
      ...currentWorkflow,
      nodes,
      updatedAt: new Date()
    });
  }

  deleteNode(nodeId: string): void {
    const currentWorkflow = this.workflow.value;
    const nodes = currentWorkflow.nodes.filter(node => node.id !== nodeId);
    const connections = currentWorkflow.connections.filter(
      conn => conn.source !== nodeId && conn.target !== nodeId
    );

    this.workflow.next({
      ...currentWorkflow,
      nodes,
      connections,
      updatedAt: new Date()
    });
  }

  addConnection(source: string, target: string, sourceOutput: number = 0, targetInput: number = 0): void {
    const currentWorkflow = this.workflow.value;
    
    // Check if connection already exists
    const exists = currentWorkflow.connections.some(
      conn => conn.source === source && conn.target === target &&
              conn.sourceOutput === sourceOutput && conn.targetInput === targetInput
    );

    if (!exists) {
      const newConnection: Connection = {
        id: `conn_${Date.now()}`,
        source,
        target,
        sourceOutput,
        targetInput
      };

      this.workflow.next({
        ...currentWorkflow,
        connections: [...currentWorkflow.connections, newConnection],
        updatedAt: new Date()
      });
    }
  }

  deleteConnection(connectionId: string): void {
    const currentWorkflow = this.workflow.value;
    const connections = currentWorkflow.connections.filter(conn => conn.id !== connectionId);

    this.workflow.next({
      ...currentWorkflow,
      connections,
      updatedAt: new Date()
    });
  }

  selectNode(node: Node | null): void {
    this.selectedNode.next(node);
  }

  hoverConnection(connectionId: string | null): void {
    this.hoveredConnection.next(connectionId);
  }

  toggleWorkflowActive(): void {
    const currentWorkflow = this.workflow.value;
    this.workflow.next({
      ...currentWorkflow,
      active: !currentWorkflow.active,
      updatedAt: new Date()
    });
  }

  executeWorkflow(): void {
    console.log('Executing workflow:', this.workflow.value);
    // Implement workflow execution logic
  }
}
