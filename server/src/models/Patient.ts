import { Schema, model, InferSchemaType } from 'mongoose';
import { CONDITIONS, GENDERS, PATIENT_STATUSES } from '../constants';

const patientSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    nameLower: { type: String, required: true },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, enum: [...GENDERS], required: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    condition: { type: String, enum: [...CONDITIONS], required: true },
    status: { type: String, enum: [...PATIENT_STATUSES], default: 'active' },
    visitDate: { type: Date, required: true, default: Date.now },
    notes: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

patientSchema.pre('validate', function (next) {
  if (this.name) this.nameLower = this.name.toLowerCase();
  next();
});

// Virtual populate -> `patient.doctor` without touching `doctorId`.
patientSchema.virtual('doctor', {
  ref: 'Doctor',
  localField: 'doctorId',
  foreignField: '_id',
  justOne: true,
});

// ESR: Equality, Sort, Range
patientSchema.index({ doctorId: 1, createdAt: -1 });
patientSchema.index({ condition: 1, createdAt: -1 });
patientSchema.index({ status: 1, createdAt: -1 });
patientSchema.index({ nameLower: 1 });
patientSchema.index({ visitDate: -1 });
patientSchema.index({ createdAt: -1, _id: -1 }); // compound: covers default sort with _id tie-breaker

export type PatientDoc = InferSchemaType<typeof patientSchema>;
export const Patient = model('Patient', patientSchema);
