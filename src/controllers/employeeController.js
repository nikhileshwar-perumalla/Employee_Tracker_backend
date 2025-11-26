import { Employee } from '../models/Employee.js';
import { Task } from '../models/Task.js';
import { httpError } from '../middleware/errorHandler.js';
import { parsePagination, parseSort, buildSearchFilter } from '../utils/apiFeatures.js';

export async function listEmployees(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const sort = parseSort(req.query.sort, '-createdAt');

  const searchFilter = buildSearchFilter(req.query, ['name', 'email', 'role', 'department']);
  const filters = { ...searchFilter };

  const [items, total] = await Promise.all([
    Employee.find(filters).sort(sort).skip(skip).limit(limit),
    Employee.countDocuments(filters)
  ]);

  res.json({ page, limit, total, items });
}

export async function getEmployee(req, res) {
  const doc = await Employee.findById(req.params.id);
  if (!doc) throw httpError(404, 'Employee not found', 'NotFound');
  res.json(doc);
}

export async function createEmployee(req, res) {
  const doc = await Employee.create(req.body);
  res.status(201).json(doc);
}

export async function updateEmployee(req, res) {
  const doc = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!doc) throw httpError(404, 'Employee not found', 'NotFound');
  res.json(doc);
}

export async function deleteEmployee(req, res) {
  const doc = await Employee.findByIdAndDelete(req.params.id);
  if (!doc) throw httpError(404, 'Employee not found', 'NotFound');
  res.status(204).send();
}

export async function listEmployeeTasks(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const sort = parseSort(req.query.sort, '-createdAt');

  const employeeId = req.params.id;
  // Ensure employee exists (404 if not)
  const emp = await Employee.findById(employeeId).select('_id');
  if (!emp) throw httpError(404, 'Employee not found', 'NotFound');

  const filters = { assignedTo: employeeId };
  if (req.query.status) filters.status = req.query.status;
  const searchFilter = buildSearchFilter(req.query, ['title', 'description']);
  const query = { ...filters, ...searchFilter };

  const [items, total] = await Promise.all([
    Task.find(query).populate('assignedTo', 'name email role department').sort(sort).skip(skip).limit(limit),
    Task.countDocuments(query)
  ]);

  res.json({ page, limit, total, items });
}
