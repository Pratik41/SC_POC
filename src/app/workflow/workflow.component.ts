import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as joint from 'jointjs';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements AfterViewInit {
  @ViewChild('paperContainer') paperContainer!: ElementRef;
  modalOpen: boolean = false;
  selectedNode: any = {};
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  private nodeCount = 0;

  ngAfterViewInit(): void {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: this.paperContainer.nativeElement,
      model: this.graph,
      width: '100%',
      height: '100%',
      gridSize: 10,
      drawGrid: true,
      interactive: true
    });
  }

  addNode(type: string) {
    console.log('Adding node of type:', type);  // Debugging: check if method is triggered

    const node = new joint.shapes.devs.Model({
      position: { x: 100 + this.nodeCount * 30, y: 100 + this.nodeCount * 30 },
      size: { width: 160, height: 80 },
      inPorts: ['in'],
      outPorts: ['out'],
      attrs: {
        '.label': { text: `${type} Node`, 'ref-x': 0.5, 'ref-y': 0.2 },
        rect: {
          fill: type === 'Service' ? '#3498db' : '#2ecc71',
          stroke: '#34495e',
          rx: 10, // Rounded corners
          ry: 10
        },
        '.inPorts circle': { fill: '#1abc9c', r: 8 },
        '.outPorts circle': { fill: '#f39c12', r: 8 }
      }
    });

    // Add the node to the graph
    this.graph.addCell(node);
    this.nodeCount++;

    console.log('Node added to the graph:', node);

    node.on('cell:pointerdblclick', () => {
      this.openNodeConfig(node);  // Open node config on double-click
    });
  }

  openNodeConfig(node: any) {
    this.selectedNode = { ...node.attributes.attrs };
    this.modalOpen = true;
  }

  handleSave(data: any) {
    const node = this.graph.getCell(this.selectedNode.id);
    if (node) {
      node.attr('.label', { text: data.label });
      node.attr('.body', { fill: data.type === 'Service' ? '#3498db' : '#2ecc71' });
    }
    this.modalOpen = false;
    this.saveWorkflow();
  }

  handleNodeTrigger(node: any) {
    console.log('Manual trigger for node:', node);
    alert(`Triggered ${node.name} of type ${node.type}`);
  }

  saveWorkflow() {
    const jsonData = this.graph.toJSON();
    localStorage.setItem('workflow', JSON.stringify(jsonData));
    alert('Workflow saved!');
  }

  loadWorkflow() {
    const jsonData = JSON.parse(localStorage.getItem('workflow') || '{}');
    if (jsonData.nodes) {
      this.graph.fromJSON(jsonData);
      alert('Workflow loaded!');
    } else {
      alert('No saved workflow found!');
    }
  }
}
