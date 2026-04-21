import Anthropic from '@anthropic-ai/sdk';
import { createAgentExecution } from './db';

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
  const startTime = Date.now();
  try {
    const messages: AgentMessage[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ];

    const systemPrompt = `You are a helpful AI agent. You have access to tools to complete tasks.
When you need to perform an action, call the appropriate tool.
Always be clear about what you're doing and why.`;

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

    const executionTimeMs = Date.now() - startTime;
    const toolsUsed = response.content.filter(c => c.type === 'tool_use').map(c => (c as any).name);

    await createAgentExecution({
      project_id: projectId,
      user_id: userId,
      input_message: userMessage,
      output_message: response.content.map(c => {
        if (c.type === 'text') return c.text;
        if (c.type === 'tool_use') return `[Tool call: ${(c as any).name}]`;
        return '';
      }).join('\n'),
      tools_used: toolsUsed,
      input_tokens: response.usage?.input_tokens,
      output_tokens: response.usage?.output_tokens,
      execution_time_ms: executionTimeMs,
      status: 'completed',
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
      executionTimeMs,
    };
  } catch (error) {
    const executionTimeMs = Date.now() - startTime;
    await createAgentExecution({
      project_id: projectId,
      user_id: userId,
      input_message: userMessage,
      execution_time_ms: executionTimeMs,
      status: 'failed',
      error_message: String(error),
    });

    throw error;
  }
}

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
    console.log('Would save to table:', input.table, input.data);
    return `Data saved to ${input.table}`;
  } catch (error) {
    return `Error saving data: ${error}`;
  }
}
