import * as ticketRepo from '../repositories/ticket.repository';
import { classifyTicket } from './ai.service';
import { CreateTicketInput, UpdateTicketInput } from '../types';

export async function getAllTickets() {
  return ticketRepo.findAll();
}

export async function getTicketById(id: string) {
  const ticket = await ticketRepo.findById(id);
  if (!ticket) return null;
  return ticket;
}

export async function createTicket(data: CreateTicketInput) {
  const ticket = await ticketRepo.create(data);
  classifyTicket(ticket.id);
  return ticket;
}

export async function updateTicket(id: string, data: UpdateTicketInput) {
  return ticketRepo.update(id, data);
}
