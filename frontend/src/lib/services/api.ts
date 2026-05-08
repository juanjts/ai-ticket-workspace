import { env } from '$env/dynamic/public';

const API_URL = env.PUBLIC_API_URL ?? 'http://localhost:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface Ticket {
  id: string;
  customerName: string;
  requestText: string;
  attachmentUrl: string | null;
  category: string | null;
  priority: string | null;
  summary: string | null;
  status: string;
  aiStatus: string;
  owner: string | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  ticketId: string;
  content: string;
  createdAt: string;
}

export function getTickets(): Promise<Ticket[]> {
  return request('/tickets');
}

export function getTicket(id: string): Promise<Ticket> {
  return request(`/tickets/${id}`);
}

export function createTicket(data: {
  customerName: string;
  requestText: string;
  attachmentUrl?: string;
}): Promise<Ticket> {
  return request('/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTicket(
  id: string,
  data: { status?: string; owner?: string }
): Promise<Ticket> {
  return request(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function addComment(
  ticketId: string,
  data: { content: string }
): Promise<Comment> {
  return request(`/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
