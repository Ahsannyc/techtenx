export interface AutomationTrigger {
  id: string;
  type: 'webhook' | 'schedule' | 'manual' | 'form_submission';
  config: Record<string, any>;
  conditions?: Condition[];
}

export interface Condition {
  id: string;
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
  logic: 'and' | 'or';
}

export interface AutomationAction {
  id: string;
  type: 'send_email' | 'save_database' | 'api_call' | 'slack_message' | 'webhook';
  config: Record<string, any>;
  order: number;
}

export interface Automation {
  id: string;
  project_id: string;
  user_id: string;
  name: string;
  description?: string;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_executed_at?: string;
  execution_count: number;
}

export interface AutomationExecution {
  id: string;
  automation_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  input_data: Record<string, any>;
  output_data?: Record<string, any>;
  error?: string;
  execution_time_ms: number;
  created_at: string;
}
