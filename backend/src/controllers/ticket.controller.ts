import { Request, Response } from 'express';
import * as ticketService from '../services/ticket.service';
import * as commentService from '../services/comment.service';
import {
  validateCreateTicket,
  validateUpdateTicket,
  validateCreateComment,
} from '../validators/ticket.validator';

export async function getAll(_req: Request, res: Response): Promise<void> {
  const tickets = await ticketService.getAllTickets();
  res.json(tickets);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = req.params.id as string;
  const ticket = await ticketService.getTicketById(id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }
  res.json(ticket);
}

export async function create(req: Request, res: Response): Promise<void> {
  const error = validateCreateTicket(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const ticket = await ticketService.createTicket(req.body);
  res.status(201).json(ticket);
}

export async function update(req: Request, res: Response): Promise<void> {
  const error = validateUpdateTicket(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const ticket = await ticketService.updateTicket(req.params.id as string, req.body);
  res.json(ticket);
}

export async function addComment(req: Request, res: Response): Promise<void> {
  const error = validateCreateComment(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const comment = await commentService.addComment(req.params.id as string, req.body);
  if (!comment) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  res.status(201).json(comment);
}
