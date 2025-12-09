import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: [true, 'Service name is required'],
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['web', 'mobile', 'data', 'ai_integration', 'ai_automation', 'other'],
            message: '{VALUE} is not a valid category'
        }
    },
    shortDescription: {
        type: String,
        required: [true, 'Short description is required'],
        maxlength: [200, 'Short description cannot exceed 200 characters'],
        trim: true
    },
    detailedDescription: {
        type: String,
        required: [true, 'Detailed description is required']
        // This will likely store HTML or Markdown (rich text)
    },
    icon: {
        type: String, // URL string
        default: ''
    },
    technologies: [{
        type: String,
        trim: true
    }],
    startingPrice: {
        type: Number,
        min: 0
    },
    features: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0 // Useful for controlling display order in the UI
    }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;