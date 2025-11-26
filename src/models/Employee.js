import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /.+@.+\..+/ },
    role: { type: String, required: true, trim: true, maxlength: 50 },
    department: { type: String, required: true, trim: true, maxlength: 100 }
  },
  { timestamps: true }
);

EmployeeSchema.index({ name: 'text', email: 'text', role: 'text', department: 'text' });

export const Employee = mongoose.model('Employee', EmployeeSchema);
