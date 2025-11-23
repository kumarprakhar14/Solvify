import mongoose from "mongoose";

// Define a sub-schema for line items to ensure structure
const lineItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true }
    // You might want to auto-calc subtotal in a pre-save hook: this.quantity * this.unitPrice
});

const quotationSchema = new mongoose.Schema({
    quotationId: {
        type: String,
        unique: true,
        // Note: Similar to Inquiry, implement generation logic for 'QUO-YYYY-XXXX'
    },
    inquiryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inquiry',
        required: true
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
    projectName: {
        type: String,
        required: true
    },
    lineItems: [lineItemSchema], // Array of line items
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
    termsAndConditions: {
        type: String,
        default: ''
    },
    pdfUrl: {
        type: String, // Path to generated PDF file
        default: ''
    },
    status: {
        type: String,
        enum: ['draft', 'sent', 'accepted', 'rejected'],
        default: 'draft'
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

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;