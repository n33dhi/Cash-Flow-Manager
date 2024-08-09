const mongoose = require("mongoose");
const crypto = require('crypto');

const generateShortId = () => {
    return crypto.randomBytes(2).toString('hex').toUpperCase().slice(0, 3); 
  };

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: String, required: true },
});

const UserSchema = new mongoose.Schema({
  userId: { type: String, default: generateShortId, unique: true},
  userName: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  role: { type: String, enum: ['employee', 'admin'], required: true },
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CashQuester'}],
  refreshTokens: RefreshTokenSchema,
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
