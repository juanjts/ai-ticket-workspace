import { Router } from 'express';
import { getAll, getById, create, update, addComment } from '../controllers/ticket.controller';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.patch('/:id', update);
router.post('/:id/comments', addComment);

export default router;
