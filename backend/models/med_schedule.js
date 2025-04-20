const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/.test(v); // Indian mobile validation
      },
      message: props => `${props.value} is not a valid Indian phone number!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true });

// Automatic phone number formatting
UserSchema.pre('save', function(next) {
  // Convert to +91 format if not already
  if (!this.phone.startsWith('+91')) {
    this.phone = `+91${this.phone.replace(/\D/g, '').slice(-10)}`;
  }
  next();
});

// Password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);