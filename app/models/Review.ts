import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  // Property and User Info
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false, // Optional - can review without booking
  },
  
  // Review Content
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  
  // Detailed Ratings
  cleanliness: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  location: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  amenities: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  valueForMoney: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  landlordBehavior: {
    type: Number,
    min: 1,
    max: 5,
    required: false,
  },
  
  // Review Status
  isVerified: {
    type: Boolean,
    default: false, // True if user actually stayed at the property
  },
  isApproved: {
    type: Boolean,
    default: true, // Can be moderated by admin
  },
  
  // Helpful Votes
  helpfulCount: {
    type: Number,
    default: 0,
  },
  notHelpfulCount: {
    type: Number,
    default: 0,
  },
  
  // Landlord Response
  landlordResponse: {
    type: String,
    default: '',
  },
  landlordResponseDate: {
    type: Date,
  },
  
  // User Info (denormalized for performance)
  userName: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['buyer', 'agent', 'builder'],
    default: 'buyer',
  },
}, {
  timestamps: true,
});

// Indexes
ReviewSchema.index({ propertyId: 1, isApproved: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });
ReviewSchema.index({ rating: -1 });
ReviewSchema.index({ helpfulCount: -1 });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
