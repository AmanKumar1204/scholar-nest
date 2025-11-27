# Scholar-Nest

A comprehensive PG (Paying Guest) accommodation platform built with Next.js, designed to connect students and professionals with quality accommodation options.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## Features

### Authentication & Authorization
- **Multi-role Authentication**: Support for Students, Property Owners, and Agents
- **Google OAuth Integration**: Seamless sign-in with Google
- **Role-based Access Control**: Different permissions for different user types
- **Secure Session Management**: Using NextAuth.js

### Property Management
- **Property Listings**: Browse and search PG accommodations
- **Advanced Upload System**: Multi-image upload with Cloudinary integration
- **Room Type Management**: Support for multiple room configurations
- **Interactive Map Picker**: Location selection with map interface
- **Property Details**: Comprehensive property information including amenities

### User Features
- **User Dashboard**: Personalized dashboard for managing properties
- **Profile Management**: Update user information and preferences
- **Booking System**: Request and manage bookings
- **Review System**: Rate and review properties
- **Messaging**: Direct communication between users

### UI/UX
- **Responsive Design**: Mobile-first approach
- **Modern Interface**: Clean and intuitive user interface
- **Image Gallery**: Beautiful property image displays
- **Form Validation**: Client and server-side validation
- **Loading States**: Smooth loading experiences

## Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Image Upload**: Cloudinary

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **File Upload**: Cloudinary API
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (Atlas recommended)
- Cloudinary account (for image uploads)
- Google OAuth credentials (optional, for Google sign-in)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AmanKumar1204/scholar-nest.git
   cd scholar-nest
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # NextAuth
   NEXTAUTH_SECRET=your_nextauth_secret_key
   NEXTAUTH_URL=your_app_url

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## Project Structure

```
scholar-nest/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── properties/      # Property management
│   │   └── upload/          # File upload endpoints
│   ├── components/          # React components
│   │   ├── forms/           # Form components
│   │   ├── layout/          # Layout components
│   │   └── ui/              # UI components
│   ├── lib/                 # Utility functions
│   ├── models/              # Mongoose models
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── properties/          # Property pages
│   └── user/                # User dashboard
├── lib/                     # Shared libraries
│   ├── cloudinary.ts        # Cloudinary configuration
│   └── mongodb.ts           # MongoDB connection
├── public/                  # Static assets
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/[...nextauth]` - NextAuth endpoints

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create new property
- `GET /api/properties/[id]` - Get property details
- `PUT /api/properties/[id]` - Update property
- `DELETE /api/properties/[id]` - Delete property

### Upload
- `POST /api/upload` - Upload images to Cloudinary

## Authentication

The platform supports multiple authentication methods:

### Email/Password Authentication
- Secure password hashing with bcrypt
- Email validation
- Role-based registration (Student, Owner, Agent)

### Google OAuth
- One-click sign-in with Google
- Automatic profile creation
- Secure token management

### Session Management
- JWT-based sessions
- Secure cookie storage
- Automatic session refresh

## User Roles

### Student
- Browse properties
- Book accommodations
- Leave reviews
- Message property owners

### Property Owner
- List properties
- Manage bookings
- Respond to inquiries
- View analytics

### Agent
- List multiple properties
- Manage client bookings
- Commission tracking
- Advanced analytics

## Build & Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image Management
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Payment integration
- [ ] Advanced search filters
- [ ] Real-time chat
- [ ] Property comparison
- [ ] Virtual tours
- [ ] Tenant verification
- [ ] Automated rent collection

## Project Status

Current Version: 1.0.0

- Phase 1: Core Features Complete
- Authentication System
- Property Upload System
- Role-based Access Control

---

**Made with love for students and accommodation seekers**
