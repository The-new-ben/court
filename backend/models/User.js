const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'lawyer', 'plaintiff', 'judge'], required: true },
  createdAt: { type: Date, default: Date.now },
  points: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

// Remove sensitive fields when converting to JSON
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
