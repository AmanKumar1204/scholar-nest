import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  // Property and Student Info
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Booking Details
  roomType: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: false, // Can be open-ended
  },
  duration: {
    type: Number, // in months
    required: true,
    min: 1,
  },
  
  // Pricing
  monthlyRent: {
    type: Number,
    required: true,
    min: 0,
  },
  securityDeposit: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  
  // Booking Status
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled', 'Completed'],
    default: 'Pending',
  },
  
  // Student Information
  studentName: {
    type: String,
    required: true,
  },
  studentEmail: {
    type: String,
    required: true,
  },
  studentPhone: {
    type: String,
    required: true,
  },
  
  // Additional Info
  numberOfOccupants: {
    type: Number,
    default: 1,
    min: 1,
  },
  specialRequests: {
    type: String,
    default: '',
  },
  
  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid', 'Refunded'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Online', 'Bank Transfer', 'UPI', 'Not Specified'],
    default: 'Not Specified',
  },
  
  // Timestamps for status changes
  confirmedAt: {
    type: Date,
  },
  rejectedAt: {
    type: Date,
  },
  cancelledAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  
  // Cancellation/Rejection Reason
  cancellationReason: {
    type: String,
    default: '',
  },
  rejectionReason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Indexes
BookingSchema.index({ propertyId: 1, status: 1 });
BookingSchema.index({ studentId: 1, status: 1 });
BookingSchema.index({ landlordId: 1, status: 1 });
BookingSchema.index({ checkInDate: 1, checkOutDate: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
