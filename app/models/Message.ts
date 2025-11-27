import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  // Conversation Participants
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Related Property (optional)
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: false,
  },
  
  // Related Booking (optional)
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: false,
  },
  
  // Message Content
  message: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  
  // Message Type
  messageType: {
    type: String,
    enum: ['text', 'image', 'document', 'system'],
    default: 'text',
  },
  
  // Attachments
  attachments: [{
    url: String,
    type: String, // 'image', 'document', 'pdf'
    name: String,
    size: Number,
  }],
  
  // Message Status
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
  },
  
  // Conversation ID (for grouping messages)
  conversationId: {
    type: String,
    required: true,
    index: true,
  },
  
  // Sender Info (denormalized)
  senderName: {
    type: String,
    required: true,
  },
  senderType: {
    type: String,
    enum: ['buyer', 'agent', 'builder'],
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ receiverId: 1, isRead: 1 });
MessageSchema.index({ propertyId: 1 });

// Static method to generate conversation ID
MessageSchema.statics.generateConversationId = function(userId1: string, userId2: string) {
  // Sort IDs to ensure consistent conversation ID regardless of who sends first
  const ids = [userId1, userId2].sort();
  return `${ids[0]}_${ids[1]}`;
};

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
