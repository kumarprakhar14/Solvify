// This is a separate model for maintaining counters for
// different sequences.
// It basically auto-generates a custom id for other collections

import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;