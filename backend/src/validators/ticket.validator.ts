export function validateCreateTicket(body: any): string | null {
  if (!body || typeof body !== 'object') {
    return 'Request body is required';
  }
  if (!body.customerName || typeof body.customerName !== 'string') {
    return 'customerName is required and must be a string';
  }
  if (!body.requestText || typeof body.requestText !== 'string') {
    return 'requestText is required and must be a string';
  }
  return null;
}

export function validateUpdateTicket(body: any): string | null {
  if (!body || typeof body !== 'object') {
    return 'Request body is required';
  }
  if (body.status && !['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(body.status)) {
    return 'Invalid status value';
  }
  if (!body.owner || typeof body.owner !== 'string' || body.owner.trim().length < 1) {
    return 'owner is required and must be a non-empty string';
  }
  return null;
}

export function validateCreateComment(body: any): string | null {
  if (!body || typeof body !== 'object') {
    return 'Request body is required';
  }
  if (!body.content || typeof body.content !== 'string') {
    return 'content is required and must be a string';
  }
  return null;
}
