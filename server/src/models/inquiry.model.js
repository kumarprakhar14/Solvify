import mongoose from "mongoose";

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

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;