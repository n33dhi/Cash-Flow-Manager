const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: {type: String, required: true},
    amount: { type: Number, required: true},
    category: { type: String, required: true, enum: [
        'travel', 'office supplies', 'employee reimbursements'], default: 'travel'},
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    approvedBy: { type: String, required: true},
}, {
    timestamps: true
})

const newRequestSchema = mongoose.model("Requests", RequestSchema)

module.exports = newRequestSchema;