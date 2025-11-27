import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  mobile: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: false,
  },
  userType: {
    type: String,
    enum: ['buyer', 'agent', 'builder'],
    default: 'buyer',
  },
  // Google OAuth fields
  googleId: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  image: {
    type: String,
    required: false,
  },
  provider: {
    type: String,
    enum: ['credentials', 'google'],
    default: 'credentials',
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  resetPasswordToken: {
    type: String,
    required: false,
  },
  resetPasswordExpires: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
