const mongoose = require('mongoose');
const { Schema } = mongoose;

const BudgetSchema = new Schema({
  amount: { type: Number, required: true, default: 0, min: 0 },
  initialAmount: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0},
  budgetSet: { type: Boolean, default: false },
  month: { type: Number, 
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 
    required: true },
  year: { type: Number, required: true },
}, { 
  timestamps: true 
});



module.exports = mongoose.model('Budget', BudgetSchema);
