import mongoose from 'mongoose';

const AllocationSchema = new mongoose.Schema(
  {
    invoiceId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['cheque', 'cash'], required: true },

    customerId: { type: String, required: true },
    customerName: { type: String, required: true },

    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },

    // Cheque specific
    chequeNumber: { type: String },
    bankName: { type: String },
    branch: { type: String },
    pdcDate: { type: Date },
    chequeImageUrl: { type: String },

    // Cash specific
    cashReceiptNumber: { type: String },
    depositSlipUrl: { type: String },

    // Lifecycle
    status: {
      type: String,
      enum: ['created', 'deposited', 'cleared', 'bounced'],
      default: 'created',
      index: true,
    },
    depositedAt: { type: Date },
    clearedAt: { type: Date },
    bouncedAt: { type: Date },
    bounceReason: { type: String },
    bounceCharges: { type: Number, min: 0 },
    nextActionDate: { type: Date },

    // Reconciliation
    allocations: { type: [AllocationSchema], default: [] },

    // Reminders
    reminderPreference: {
      type: String,
      enum: ['none', 'pre_pdc', 'post_deposit', 'both'],
      default: 'pre_pdc',
    },
    lastReminderAt: { type: Date },

    // Risk
    riskScore: { type: Number, default: 0 },
    riskLabel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },

    notes: { type: String },
    collectorId: { type: String },
  },
  { timestamps: true }
);

PaymentSchema.index({ pdcDate: 1 });
PaymentSchema.index({ customerId: 1, status: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);


