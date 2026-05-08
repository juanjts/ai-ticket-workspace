import { Request, Response } from 'express';

export async function getAll(_req: Request, res: Response): Promise<void> {
  res.json({ tickets: [] });
}

export async function getById(req: Request, res: Response): Promise<void> {
  res.json({ ticket: null });
}

export async function create(req: Request, res: Response): Promise<void> {
  res.status(201).json({ ticket: null });
}
