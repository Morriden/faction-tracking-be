const mongoose = require('mongoose');

const users = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.passwordHash;
      delete ret.id;
    }
  }
});

module.exports = mongoose.model('User', users);
