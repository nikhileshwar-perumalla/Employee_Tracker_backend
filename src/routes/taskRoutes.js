import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { listTasks, getTask, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = Router();

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isString(),
    query('search').optional().isString(),
    query('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    query('assignedTo').optional().isMongoId()
  ],
  validateRequest,
  asyncHandler(listTasks)
);

router.get(
  '/:id',
  [param('id').isMongoId()],
  validateRequest,
  asyncHandler(getTask)
);

router.post(
  '/',
  [
    body('title').isString().isLength({ min: 1, max: 200 }),
    body('description').optional().isString(),
    body('assignedTo').isMongoId(),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('dueDate').optional().isISO8601().toDate()
  ],
  validateRequest,
  asyncHandler(createTask)
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 1, max: 200 }),
    body('description').optional().isString(),
    body('assignedTo').optional().isMongoId(),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('dueDate').optional().isISO8601().toDate()
  ],
  validateRequest,
  asyncHandler(updateTask)
);

router.patch(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 1, max: 200 }),
    body('description').optional().isString(),
    body('assignedTo').optional().isMongoId(),
    body('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    body('priority').optional().isIn(['Low', 'Medium', 'High']),
    body('dueDate').optional().isISO8601().toDate()
  ],
  validateRequest,
  asyncHandler(updateTask)
);

router.delete(
  '/:id',
  [param('id').isMongoId()],
  validateRequest,
  asyncHandler(deleteTask)
);

export default router;
