import mongoose from 'mongoose';

// Room Type Sub-schema
const RoomTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Single', 'Double', 'Triple', 'Dormitory'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  occupied: {
    type: Number,
    default: 0,
    min: 0,
  },
  pricePerBed: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Image Metadata Sub-schema
const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  isMain: {
    type: Boolean,
    default: false,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    enum: ['Shared Room', 'Single Room', 'Apartment', 'PG', 'Hostel', 'Flat'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  bedrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  bathrooms: {
    type: Number,
    required: true,
    min: 0,
  },
  area: {
    type: Number, // in square feet
    required: false,
  },
  
  // Room Types and Capacities
  roomTypes: {
    type: [RoomTypeSchema],
    default: [],
  },
  totalCapacity: {
    type: Number,
    default: 0,
  },
  currentOccupancy: {
    type: Number,
    default: 0,
  },
  
  // Location details
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  nearbyCollege: {
    type: String,
    required: false,
  },
  distanceFromCollege: {
    type: Number, // in kilometers
    required: false,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
  },
  
  // Amenities
  amenities: {
    type: [String],
    default: [],
  },
  
  // Food Options
  foodIncluded: {
    type: Boolean,
    default: false,
  },
  foodType: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Both', 'Not Provided'],
    default: 'Not Provided',
  },
  mealsProvided: {
    type: [String], // ['Breakfast', 'Lunch', 'Dinner']
    default: [],
  },
  
  // Gender Preference
  genderPreference: {
    type: String,
    enum: ['Male', 'Female', 'Any'],
    default: 'Any',
  },
  
  // House Rules
  houseRules: {
    type: [String],
    default: [],
  },
  
  // Availability
  availableFrom: {
    type: Date,
    required: false,
  },
  availableTo: {
    type: Date,
    required: false,
  },
  minimumStay: {
    type: Number, // in months
    default: 1,
  },
  
  // Images with metadata
  images: {
    type: [ImageSchema],
    default: [],
  },
  mainImage: {
    type: String,
    required: false,
  },
  
  // Landlord information
  landlordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  landlordName: {
    type: String,
    required: true,
  },
  landlordEmail: {
    type: String,
    required: true,
  },
  landlordPhone: {
    type: String,
    required: false,
  },
  
  // Property status
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationDocuments: {
    type: [String], // URLs to verification documents
    default: [],
  },
  
  // Additional details
  furnishingStatus: {
    type: String,
    enum: ['Fully Furnished', 'Semi Furnished', 'Unfurnished'],
    default: 'Unfurnished',
  },
  preferredTenants: {
    type: String,
    enum: ['Students', 'Working Professionals', 'Family', 'Any'],
    default: 'Any',
  },
  securityDeposit: {
    type: Number,
    required: false,
    min: 0,
  },
  maintenanceCharges: {
    type: Number,
    required: false,
    min: 0,
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0,
  },
  inquiries: {
    type: Number,
    default: 0,
  },
  bookings: {
    type: Number,
    default: 0,
  },
  
  // Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes for search optimization
PropertySchema.index({ city: 1, propertyType: 1, price: 1 });
PropertySchema.index({ landlordId: 1 });
PropertySchema.index({ isAvailable: 1, isVerified: 1 });
PropertySchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
PropertySchema.index({ genderPreference: 1 });
PropertySchema.index({ foodIncluded: 1 });
PropertySchema.index({ averageRating: -1 });

// Virtual for available beds
PropertySchema.virtual('availableBeds').get(function() {
  return this.totalCapacity - this.currentOccupancy;
});

// Ensure virtuals are included in JSON
PropertySchema.set('toJSON', { virtuals: true });
PropertySchema.set('toObject', { virtuals: true });

export default mongoose.models.Property || mongoose.model('Property', PropertySchema);
