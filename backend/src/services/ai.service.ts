import * as ticketRepo from '../repositories/ticket.repository';
import { OpenAIProvider } from '../providers/ai/openai.provider';

export async function classifyTicket(ticketId: string) {
  try {
    await ticketRepo.updateAiFields(ticketId, { aiStatus: 'PROCESSING' });

    const provider = new OpenAIProvider();
    const ticket = await ticketRepo.findById(ticketId);
    if (!ticket) return;

    const result = await provider.classifyTicket(ticket.requestText);

    await ticketRepo.updateAiFields(ticketId, {
      category: result.category,
      priority: result.priority,
      summary: result.summary,
      aiStatus: 'COMPLETED',
    });
  } catch (err) {
    console.error('[AI Classification Failed]', err);
    await ticketRepo.updateAiFields(ticketId, { aiStatus: 'FAILED', priority: 'MEDIUM' });
  }
}
