import { TicketStatus, TicketPriority, TicketCategory, AIStatus } from '@prisma/client';

export type { TicketStatus, TicketPriority, TicketCategory, AIStatus };

export interface CreateTicketInput {
  customerName: string;
  requestText: string;
  attachmentUrl?: string;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  owner?: string;
}

export interface CreateCommentInput {
  content: string;
}

export interface ClassificationResult {
  category: TicketCategory;
  priority: TicketPriority;
  summary: string;
}
