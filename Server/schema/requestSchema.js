const mongoose = require("mongoose");
const crypto = require('crypto');

const generateShortId = () => {
    return crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 3); 
  };

const RequestSchema = new mongoose.Schema({
    requestId: { type: String, default: generateShortId, unique: true},
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: {type: String, required: true},
    amount: { type: Number, required: true},
    category: { type: String, required: true, enum: [
        'Travel', 'Office Supplies', 'Employee Reimbursements'], default: 'travel'},
    status: { type: String, enum: ['Pending', 'Accepted', 'Declined'], default: 'Pending' },
    approvedBy: { type: String, required: true},
}, {
    timestamps: true
})

const newRequestSchema = mongoose.model("Requests", RequestSchema)

module.exports = newRequestSchema;