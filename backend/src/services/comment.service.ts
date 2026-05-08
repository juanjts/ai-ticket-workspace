import * as ticketRepo from '../repositories/ticket.repository';
import * as commentRepo from '../repositories/comment.repository';
import { CreateCommentInput } from '../types';

export async function addComment(ticketId: string, data: CreateCommentInput) {
  const ticket = await ticketRepo.findById(ticketId);
  if (!ticket) return null;
  return commentRepo.create(ticketId, data);
}
