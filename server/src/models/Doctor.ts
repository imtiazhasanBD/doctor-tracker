import { Schema, model, InferSchemaType } from 'mongoose';

const doctorSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    nameLower: { type: String, required: true },
    specialization: { type: String, required: true, trim: true },
    hospital: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    // Denormalized: kept in sync by patient.service (transactions) + `npm run recount` as a safety net.
    patientCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

doctorSchema.pre('validate', function (next) {
  if (this.name) this.nameLower = this.name.toLowerCase();
  next();
});

doctorSchema.index({ email: 1 }, { unique: true });
doctorSchema.index({ nameLower: 1 });
doctorSchema.index({ specialization: 1, createdAt: -1 });
doctorSchema.index({ hospital: 1, createdAt: -1 });
doctorSchema.index({ createdAt: -1 });
doctorSchema.index({ patientCount: -1 });

export type DoctorDoc = InferSchemaType<typeof doctorSchema>;
export const Doctor = model('Doctor', doctorSchema);
