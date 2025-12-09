import mongoose from "mongoose";
import Counter from "./counter.model.js";

// Define a sub-schema for line items to ensure structure
const lineItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true }
});

const quotationSchema = new mongoose.Schema({
    quotationId: {
        type: String,
        unique: true,
        // Auto-generated: QUOTE-YYYY-XXXX
    },
    inquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inquiry',
        required: false // Can be created without an inquiry
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
        trim: true
    },
    clientPhone: {
        type: String,
        trim: true
    },
    clientAddress: {
        type: String,
        trim: true
    },
    subject: {
        type: String,
        required: true
    },
    projectOverview: {
        type: String,
        required: true
    },
    lineItems: [lineItemSchema], // Scope of work / Pricing breakdown
    subtotal: {
        type: Number,
        required: true,
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
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    exclusions: {
        type: String,
        default: ''
    },
    termsAndConditions: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'sent'], 
        default: 'pending' 
    },
    validUntil: {
        type: Date
    },
    generatedByAi: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Auto-increment logic for quotationId
quotationSchema.pre('save', async function(next) {
    if(this.quotationId) return next();

    const year = new Date().getFullYear();
    const counterId = `quotation_${year}`;

    try {
        const counter = await Counter.findOneAndUpdate(
            { id: counterId },
            { $inc: { seq: 1} },
            { new: true, upsert: true}
        );

        const padded = String(counter.seq).padStart(4, '0');
        this.quotationId = `QUOTE-${year}-${padded}`;
        next();
    } catch (error) {
        next(error);
    }
});

const Quotation = mongoose.model('Quotation', quotationSchema);
export default Quotation;