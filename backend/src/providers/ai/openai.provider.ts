import OpenAI from 'openai';
import { AIProvider } from './ai.provider';
import { ClassificationResult } from '../../types';

const SYSTEM_PROMPT = `You are an operational ticket classification assistant.

Analyze the provided operational request.

Return ONLY valid JSON with this structure:
{
  "category": "FINANCE | LEGAL | PROCUREMENT | OPERATIONS",
  "priority": "LOW | MEDIUM | HIGH",
  "summary": "short summary"
}`;

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing AI_API_KEY');
    }

    this.client = new OpenAI({
      baseURL: process.env.AI_BASE_URL || 'https://api.groq.com/openai/v1',
      apiKey,
    });
  }

  async classifyTicket(requestText: string): Promise<ClassificationResult> {
    const completion = await this.client.chat.completions.create({
      model: process.env.AI_MODEL || 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: requestText },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AI returned empty response');
    }

    const result = JSON.parse(content) as ClassificationResult;

    if (!['FINANCE', 'LEGAL', 'PROCUREMENT', 'OPERATIONS'].includes(result.category)) {
      throw new Error(`Invalid category: ${result.category}`);
    }
    if (!['LOW', 'MEDIUM', 'HIGH'].includes(result.priority)) {
      throw new Error(`Invalid priority: ${result.priority}`);
    }
    if (!result.summary || typeof result.summary !== 'string') {
      throw new Error('Missing or invalid summary');
    }

    return result;
  }
}
