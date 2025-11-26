import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, trim: true, default: '' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending', index: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

TaskSchema.index({ title: 'text', description: 'text' });

export const Task = mongoose.model('Task', TaskSchema);
