import { Task } from '../models/Task.js';
import { httpError } from '../middleware/errorHandler.js';
import { parsePagination, parseSort, buildSearchFilter } from '../utils/apiFeatures.js';

export async function listTasks(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const sort = parseSort(req.query.sort, '-createdAt');

  const filters = {};
  if (req.query.status) filters.status = req.query.status;
  if (req.query.assignedTo) filters.assignedTo = req.query.assignedTo;

  const searchFilter = buildSearchFilter(req.query, ['title', 'description']);
  const query = { ...filters, ...searchFilter };

  const [items, total] = await Promise.all([
    Task.find(query).populate('assignedTo', 'name email role department').sort(sort).skip(skip).limit(limit),
    Task.countDocuments(query)
  ]);

  res.json({ page, limit, total, items });
}

export async function getTask(req, res) {
  const doc = await Task.findById(req.params.id).populate('assignedTo', 'name email role department');
  if (!doc) throw httpError(404, 'Task not found', 'NotFound');
  res.json(doc);
}

export async function createTask(req, res) {
  const doc = await Task.create(req.body);
  const populated = await doc.populate('assignedTo', 'name email role department');
  res.status(201).json(populated);
}

export async function updateTask(req, res) {
  const doc = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(
    'assignedTo',
    'name email role department'
  );
  if (!doc) throw httpError(404, 'Task not found', 'NotFound');
  res.json(doc);
}

export async function deleteTask(req, res) {
  const doc = await Task.findByIdAndDelete(req.params.id);
  if (!doc) throw httpError(404, 'Task not found', 'NotFound');
  res.status(204).send();
}
