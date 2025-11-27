import { z } from 'zod';

export const roomTypeSchema = z.object({
  type: z.enum(['Single', 'Double', 'Triple', 'Dormitory']),
  capacity: z.number().min(1).max(20),
  occupied: z.number().min(0),
  pricePerBed: z.number().min(0),
});

export const imageSchema = z.object({
  url: z.string().url(),
  caption: z.string().optional(),
  isMain: z.boolean().default(false),
});

export const propertyFormSchema = z.object({
  // Basic Information
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  propertyType: z.enum(['Shared Room', 'Single Room', 'Apartment', 'PG', 'Hostel', 'Flat']),
  
  // Pricing
  price: z.number().min(0, 'Price must be positive'),
  securityDeposit: z.number().min(0).optional(),
  maintenanceCharges: z.number().min(0).optional(),
  
  // Room Details
  roomTypes: z.array(roomTypeSchema).min(1, 'At least one room type is required'),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  area: z.number().min(0).optional(),
  
  // Food Options
  foodIncluded: z.boolean().default(false),
  foodType: z.enum(['Vegetarian', 'Non-Vegetarian', 'Both', 'Not Provided']).optional(),
  mealsProvided: z.array(z.enum(['Breakfast', 'Lunch', 'Dinner'])).optional(),
  
  // Preferences
  genderPreference: z.enum(['Male', 'Female', 'Any']),
  preferredTenants: z.enum(['Students', 'Working Professionals', 'Any']).default('Any'),
  
  // Location
  address: z.string().min(10, 'Address must be at least 10 characters'),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  nearbyCollege: z.string().optional(),
  distanceFromCollege: z.number().min(0).optional(),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  
  // Amenities & Rules
  amenities: z.array(z.string()),
  houseRules: z.array(z.string()),
  
  // Images
  images: z.array(imageSchema).min(1, 'At least one image is required'),
  mainImage: z.string().url().optional(),
  
  // Availability
  availableFrom: z.date().optional(),
  availableTo: z.date().optional(),
  minimumStay: z.number().min(1).optional(),
  
  // Landlord Info
  landlordName: z.string().min(2),
  landlordEmail: z.string().email(),
  landlordPhone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
  
  // Additional
  furnishingStatus: z.enum(['Furnished', 'Semi-Furnished', 'Unfurnished']).default('Unfurnished'),
  verificationDocuments: z.array(z.string().url()).optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;
export type RoomType = z.infer<typeof roomTypeSchema>;
export type ImageData = z.infer<typeof imageSchema>;
