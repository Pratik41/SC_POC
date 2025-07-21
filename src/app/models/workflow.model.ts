export interface Node {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: any;
  inputs: string[];
  outputs: string[];
  icon?: string;
  color?: string;
}

export interface Connection {
  id: string;
  source: string;
  target: string;
  sourceOutput?: number;
  targetInput?: number;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  connections: Connection[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NodeType {
  type: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  inputs: number;
  outputs: number;
  description: string;
  config?: any;
}