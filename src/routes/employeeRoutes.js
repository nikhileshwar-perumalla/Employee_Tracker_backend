import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { listEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee, listEmployeeTasks } from '../controllers/employeeController.js';

const router = Router();

// List employees with search/sort/pagination
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
    query('sort').optional().isString(),
    query('search').optional().isString()
  ],
  validateRequest,
  asyncHandler(listEmployees)
);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid employee id')],
  validateRequest,
  asyncHandler(getEmployee)
);

router.post(
  '/',
  [
    body('name').isString().isLength({ min: 2, max: 100 }),
    body('email').isEmail(),
    body('role').isString().isLength({ min: 1, max: 50 }),
    body('department').isString().isLength({ min: 1, max: 100 })
  ],
  validateRequest,
  asyncHandler(createEmployee)
);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('name').optional().isString().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail(),
    body('role').optional().isString().isLength({ min: 1, max: 50 }),
    body('department').optional().isString().isLength({ min: 1, max: 100 })
  ],
  validateRequest,
  asyncHandler(updateEmployee)
);

router.patch(
  '/:id',
  [
    param('id').isMongoId(),
    body('name').optional().isString().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail(),
    body('role').optional().isString().isLength({ min: 1, max: 50 }),
    body('department').optional().isString().isLength({ min: 1, max: 100 })
  ],
  validateRequest,
  asyncHandler(updateEmployee)
);

router.delete(
  '/:id',
  [param('id').isMongoId()],
  validateRequest,
  asyncHandler(deleteEmployee)
);

// Tasks for specific employee
router.get(
  '/:id/tasks',
  [
    param('id').isMongoId(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('status').optional().isIn(['Pending', 'In Progress', 'Completed']),
    query('search').optional().isString(),
    query('sort').optional().isString()
  ],
  validateRequest,
  asyncHandler(listEmployeeTasks)
);

export default router;
