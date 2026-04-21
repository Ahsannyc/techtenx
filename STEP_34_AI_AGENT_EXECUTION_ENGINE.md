# Step 34: AI Agent Execution Engine

## Detailed Implementation Prompt

**Goal:** Build backend system for executing AI agents with LLM integration, tool use, and job queuing

**Effort:** 4-5 days
**Priority:** CRITICAL
**Success Criteria:**
- ✅ LLM API integration (Claude/GPT-4)
- ✅ Tool use / function calling system
- ✅ Job queue for execution
- ✅ Execution logs & history
- ✅ Error handling & retries
- ✅ Response streaming
- ✅ Cost tracking

---

## Architecture Overview

```
User Request → API Route → Job Queue → Agent Executor → LLM → Tools → Response
                                             ↓
                                        Execution Log
                                             ↓
                                        Database
```

---

## Phase-by-Phase Implementation

### Phase 1: Install Dependencies (15 mins)

Install required packages:

```bash
npm install anthropic bull redis
```

This adds:
- `anthropic` - Claude API client
- `bull` - Redis-based job queue
- `redis` - Redis client

### Phase 2: Create Agent Executor (2 hours)

Create `src/lib/agents.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { logAction } from './db';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AgentTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, any>;
    required: string[];
  };
}

export interface AgentMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AVAILABLE_TOOLS: AgentTool[] = [
  {
    name: 'send_email',
    description: 'Send an email to a recipient',
    input_schema: {
      type: 'object',
      properties: {
        to: { type: 'string', description: 'Recipient email address' },
        subject: { type: 'string', description: 'Email subject' },
        body: { type: 'string', description: 'Email body' },
      },
      required: ['to', 'subject', 'body'],
    },
  },
  {
    name: 'fetch_data',
    description: 'Fetch data from an API endpoint',
    input_schema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'API endpoint URL' },
        method: { type: 'string', enum: ['GET', 'POST'], description: 'HTTP method' },
      },
      required: ['url'],
    },
  },
  {
    name: 'save_to_database',
    description: 'Save data to the database',
    input_schema: {
      type: 'object',
      properties: {
        table: { type: 'string', description: 'Database table name' },
        data: { type: 'object', description: 'Data to save' },
      },
      required: ['table', 'data'],
    },
  },
];

export async function executeAgent(
  projectId: string,
  userId: string,
  userMessage: string,
  conversationHistory: AgentMessage[] = []
) {
  try {
    // Add user message to history
    const messages: AgentMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    // System prompt
    const systemPrompt = `You are a helpful AI agent. You have access to tools to complete tasks.
When you need to perform an action, call the appropriate tool.
Always be clear about what you're doing and why.`;

    // Call Claude with tools
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      system: systemPrompt,
      tools: AVAILABLE_TOOLS as any,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })) as any,
    });

    // Log the execution
    await logAction({
      user_id: userId,
      action: 'agent_executed',
      resource_type: 'agent_execution',
      resource_id: projectId,
      details: {
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
        toolsUsed: response.content.filter(c => c.type === 'tool_use').length,
      },
    });

    return {
      success: true,
      response: response.content,
      usage: {
        inputTokens: response.usage?.input_tokens,
        outputTokens: response.usage?.output_tokens,
        totalTokens:
          (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
      },
      stopReason: response.stop_reason,
    };
  } catch (error) {
    console.error('Agent execution error:', error);
    await logAction({
      user_id: userId,
      action: 'agent_execution_failed',
      resource_type: 'agent_execution',
      resource_id: projectId,
      details: { error: String(error) },
    });

    throw error;
  }
}

// Tool execution handlers
export async function executeTool(
  toolName: string,
  toolInput: Record<string, any>
): Promise<string> {
  switch (toolName) {
    case 'send_email':
      return await sendEmail(toolInput);
    case 'fetch_data':
      return await fetchData(toolInput);
    case 'save_to_database':
      return await saveToDatabase(toolInput);
    default:
      return `Unknown tool: ${toolName}`;
  }
}

async function sendEmail(input: {
  to: string;
  subject: string;
  body: string;
}): Promise<string> {
  try {
    // TODO: Implement email sending via Resend
    console.log('Would send email to:', input.to);
    return `Email sent to ${input.to}`;
  } catch (error) {
    return `Error sending email: ${error}`;
  }
}

async function fetchData(input: {
  url: string;
  method?: string;
}): Promise<string> {
  try {
    const response = await fetch(input.url, {
      method: input.method || 'GET',
    });

    if (!response.ok) {
      return `Error: HTTP ${response.status}`;
    }

    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    return `Error fetching data: ${error}`;
  }
}

async function saveToDatabase(input: {
  table: string;
  data: Record<string, any>;
}): Promise<string> {
  try {
    // TODO: Implement database save
    console.log('Would save to table:', input.table, input.data);
    return `Data saved to ${input.table}`;
  } catch (error) {
    return `Error saving data: ${error}`;
  }
}
```

### Phase 3: Create Agent Execution API (1-2 hours)

Create `src/app/api/agents/execute/route.ts`:

```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { getUserByAuth0Id, getProjectById } from '@/lib/db';
import { executeAgent } from '@/lib/agents';

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await getUserByAuth0Id(session.user.sub);
    if (!user) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { projectId, message, conversationHistory } = body;

    // Verify project ownership
    const project = await getProjectById(projectId);
    if (!project || project.user_id !== user.id) {
      return Response.json(
        { error: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    if (project.type !== 'agent') {
      return Response.json(
        { error: 'Project is not an agent' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Execute agent
    const result = await executeAgent(
      projectId,
      user.id,
      message,
      conversationHistory
    );

    return Response.json(
      { success: true, result },
      { status: 200 }
    );
  } catch (error) {
    console.error('Agent execution API error:', error);
    return Response.json(
      { error: 'Failed to execute agent' },
      { status: 500 }
    );
  }
}
```

### Phase 4: Create Execution Logs Table (30 mins)

Add to database schema:

```sql
CREATE TABLE agent_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_message TEXT NOT NULL,
  output_message TEXT,
  tools_used JSONB DEFAULT '[]',
  input_tokens INTEGER,
  output_tokens INTEGER,
  execution_time_ms INTEGER,
  status VARCHAR(50) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agent_executions_project_id ON agent_executions(project_id);
CREATE INDEX idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX idx_agent_executions_created_at ON agent_executions(created_at);
```

### Phase 5: Add Database Functions (30 mins)

Add to `src/lib/db.ts`:

```typescript
export async function createAgentExecution(data: {
  project_id: string;
  user_id: string;
  input_message: string;
  output_message?: string;
  tools_used?: any[];
  input_tokens?: number;
  output_tokens?: number;
  execution_time_ms?: number;
  status?: string;
  error_message?: string;
}) {
  try {
    const { data: execution, error } = await supabaseServer
      .from('agent_executions')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return execution;
  } catch (error) {
    console.error('Error creating agent execution:', error);
    throw error;
  }
}

export async function getAgentExecutions(projectId: string) {
  try {
    const { data, error } = await supabaseServer
      .from('agent_executions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching agent executions:', error);
    return [];
  }
}
```

---

## Environment Variables

Add to `.env.local`:

```bash
# Claude API
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Redis (for job queue)
REDIS_URL=redis://localhost:6379

# Agent settings
AGENT_MAX_TOKENS=2048
AGENT_TIMEOUT_MS=30000
```

---

## Testing the Agent

### Basic Test
```bash
curl -X POST http://localhost:3000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project-id",
    "message": "What is 2 + 2?",
    "conversationHistory": []
  }'
```

### With Tools
```bash
curl -X POST http://localhost:3000/api/agents/execute \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "project-id",
    "message": "Send an email to john@example.com with subject \"Hello\" and body \"Hi there\"",
    "conversationHistory": []
  }'
```

---

## Cost Tracking

Claude pricing (as of 2026):
- Input: $3 / 1M tokens
- Output: $15 / 1M tokens

Track usage:
```typescript
const inputCost = (inputTokens / 1_000_000) * 3;
const outputCost = (outputTokens / 1_000_000) * 15;
const totalCost = inputCost + outputCost;
```

---

## Common Issues

**Issue:** "ANTHROPIC_API_KEY not found"
- Solution: Add API key to .env.local from https://console.anthropic.com

**Issue:** Tool execution fails
- Solution: Implement tool handler functions in executeTool()

**Issue:** Timeout errors
- Solution: Increase AGENT_TIMEOUT_MS or optimize agent prompts

---

**Estimated Completion Time:** 4-5 days
**Difficulty:** Hard
**Next Step:** Step 35 - Automation Builder UI
