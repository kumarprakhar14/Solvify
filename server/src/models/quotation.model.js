import mongoose from "mongoose";
import Counter from "./counter.model.js";

// Define a sub-schema for line items to ensure structure
const lineItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    unitPrice: { type: Number, required: true, default: 0, min: 0 },
    subtotal: { type: Number, required: true, default: 0 }
});

const quotationSchema = new mongoose.Schema({
    quotationId: {
        type: String,
        unique: true,
    },
    inquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inquiry',
        required: false
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    clientEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    clientCompany: {
        type: String,
        default: ''
    },
    clientPhone: {
        type: String,
        default: ''
    },
    clientAddress: {
        type: String,
        default: ''
    },
    subject: {
        type: String,
        default: ''
    },
    projectName: {
        type: String,
        default: ''
    },
    projectOverview: {
        type: String,
        default: ''
    },
    lineItems: [lineItemSchema],
    subtotal: {
        type: Number,
        default: 0,
        min: 0
    },
    taxPercentage: {
        type: Number,
        default: 0,
        min: 0
    },
    taxAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentTerms: {
        type: String,
        default: 'Milestone 1: 40%, Milestone 2: 30%, Milestone 3: 30%'
    },
    timeline: {
        type: String,
        default: ''
    },
    exclusions: {
        type: String,
        default: ''
    },
    termsAndConditions: {
        type: String,
        default: ''
    },
    validUntil: {
        type: String,
        default: ''
    },
    pdfUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'approved', 'sent', 'rejected', 'accepted'],
        default: 'pending'
    },
    generatedByAi: {
        type: Boolean,
        default: false
    },
    aiError: {
        type: String,
        default: ''
    },
    sentAt: {
        type: Date
    },
    respondedAt: {
        type: Date
    }
}, {
    timestamps: true
});

quotationSchema.pre('save', async function(next) {
    if (this.quotationId) return next();

    const year = new Date().getFullYear();
    const counterId = `quotation_${year}`;

    const counter = await Counter.findOneAndUpdate(
        { id: counterId },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const padded = String(counter.seq).padStart(4, '0');
    this.quotationId = `QUO-${year}-${padded}`;

    if (!this.projectName) {
        this.projectName = this.subject || `${this.clientName}'s Project`;
    }
    if (!this.subject) {
        this.subject = this.projectName;
    }

    next();
});

const Quotation = mongoose.model('Quotation', quotationSchema);

export default Quotation;