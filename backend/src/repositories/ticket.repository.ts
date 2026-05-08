import prisma from '../lib/prisma';
import { CreateTicketInput, UpdateTicketInput } from '../types';

export async function findAll() {
  return prisma.ticket.findMany({
    include: { comments: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function findById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: { comments: { orderBy: { createdAt: 'asc' } } },
  });
}

export async function create(data: CreateTicketInput) {
  return prisma.ticket.create({
    data: {
      customerName: data.customerName,
      requestText: data.requestText,
      attachmentUrl: data.attachmentUrl ?? null,
    },
  });
}

export async function update(id: string, data: UpdateTicketInput) {
  return prisma.ticket.update({
    where: { id },
    data,
  });
}

export async function updateAiFields(
  id: string,
  data: {
    category?: string;
    priority?: string;
    summary?: string;
    aiStatus?: string;
  }
) {
  return prisma.ticket.update({
    where: { id },
    data: data as any,
  });
}
