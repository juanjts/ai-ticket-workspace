import prisma from '../lib/prisma';
import { CreateCommentInput } from '../types';

export async function findByTicketId(ticketId: string) {
  return prisma.comment.findMany({
    where: { ticketId },
    orderBy: { createdAt: 'asc' },
  });
}

export async function create(ticketId: string, data: CreateCommentInput) {
  return prisma.comment.create({
    data: {
      ticketId,
      content: data.content,
    },
  });
}
