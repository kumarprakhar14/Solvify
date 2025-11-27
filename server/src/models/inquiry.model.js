import mongoose from "mongoose";
import Counter from "./counter.model.js"

const inquirySchema = new mongoose.Schema({
    inquiryId: {
        type: String,
        unique: true,
        // Note: You will need a pre-save hook or a plugin (like mongoose-sequence) 
        // to auto-generate this in the format 'INQ-YYYY-XXXX'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional, as specified for guests
    },
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    company: {
        type: String,
        default: ''
    },
    serviceType: {
        type: String,
        enum: {
            values: ['web development', 'app development', 'data analytics', 'ai automation', 'ai integration']
        },
        required: [true, 'Service type is required']
    },
    projectTitle: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true
    },
    projectDescription: {
        type: String,
        required: [true, 'Project description is required']
    },
    budgetRange: {
        type: String,
        required: [true, 'Budget range is required']
    },
    timeline: {
        type: String,
        required: [true, 'Timeline is required']
    },
    attachment: {
        filename: String,
        filepath: String,
        filesize: Number
    },
    referralSource: {
        type: String,
        default: ''
    },
    additionalComments: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'under_review', 'quotation_sent', 'in_progress', 'completed', 'rejected'],
            message: '{VALUE} is not a valid status'
        },
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: '' // Internal use only
    },
    quotationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quotation',
        required: false
    }
}, {
    timestamps: true
});

inquirySchema.pre('save', async function(next) {
    if(this.inquiryId) return next();  // Avoid regenerating on update

    const year = new Date().getFullYear();

    // Get the MongoDB document for the current year
    //  It will have something like:- { id: "inquiry_2025", seq: 38 }

    const counterId = `inquiry_${year}`;

    // Fetch the counter and increase it automatically
    const counter = await Counter.findOneAndUpdate(
        { id: counterId },
       { $inc: { seq: 1} },
       { new: true, upsert: true}

       // new: true -> Returns the updated document (after increment)
       // upsert: true -> If the document doesn't exist (first inquiry of the year), create it automatically
    );

    // Convert counter number into 4-digit padded number 
    // like: 1 -> 0001, 23 -> 0023
    const padded = String(counter.seq).padStart(4, '0');

    // Build the final inquiry ID
    // like: INQ-2025-0001
    this.inquiryId = `INQ-${year}-${padded}`;

    next();
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;