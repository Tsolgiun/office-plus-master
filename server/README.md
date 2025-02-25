# Office Plus Backend API Documentation

## Setup Requirements

1. Install MongoDB and ensure it's running on `mongodb://127.0.0.1:27017/office-plus`
2. Create `.env` file in the server directory with:
   ```
   JWT_SECRET=your_secret_key_here
   PORT=5000 (optional, defaults to 5000)
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication API

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "string",
    "email": "string",
    "role": "client|admin|agent",
    "profile": {
      "firstName": "string",
      "lastName": "string",
      "phone": "string",
      "company": "string",
      "position": "string",
      "avatar": "string"
    }
  }
}
```

**Error Responses:**
- 400: Email and password are required
- 401: Invalid credentials
- 500: Internal server error

#### POST /api/auth/register
Register new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response (201):** Same as login response

**Error Responses:**
- 400: Required fields missing
- 409: Email already registered
- 500: Internal server error

#### GET /api/auth/me
Get current user profile.

**Headers Required:**
```
Authorization: Bearer JWT_TOKEN
```

**Response (200):** User object without sensitive data

**Error Responses:**
- 401: Authentication required/Invalid token
- 404: User not found
- 500: Internal server error

### Properties API

#### GET /api/properties
Get paginated list of properties.

**Query Parameters:**
- page (default: 1)
- limit (default: 10)

**Response (200):**
```json
{
  "properties": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "price": "string", // Format: "$amount/period"
    "location": "string",
    "image": "string",
    "size": "string", // Format: "value unit"
    "type": "string",
    "capacity": "number",
    "amenities": ["string"],
    "availability": "string", // "Immediate" or "From date"
    "building": {
      "name": "string",
      "facilities": ["string"],
      "parkingAvailable": "boolean",
      "security": "boolean"
    }
  }],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
```

**Error Response:**
- 500: Database connection or query error

#### GET /api/properties/:id
Get single property by ID.

**Response (200):** Single property object (same structure as above)

**Error Responses:**
- 404: Property not found
- 500: Server error

#### POST /api/properties
Create new property.

**Request Body:** Property data matching Property model schema
**Response (201):** Created property object
**Error Response:** 400: Invalid property data

#### PUT /api/properties/:id
Update existing property.

**Request Body:** Updated property data
**Response (200):** Updated property object
**Error Responses:**
- 404: Property not found
- 400: Invalid update data

#### DELETE /api/properties/:id
Delete a property.

**Response (200):**
```json
{
  "message": "Property deleted"
}
```

**Error Responses:**
- 404: Property not found
- 500: Server error

## Data Models

### Property Model Schema
```javascript
{
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly'
    }
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  specifications: {
    size: {
      value: {
        type: Number,
        required: true
      },
      unit: {
        type: String,
        enum: ['m²', 'sq.m'],
        default: 'm²'
      }
    },
    capacity: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    floor: Number,
    totalFloors: Number
  },
  amenities: [{
    type: ObjectId,
    ref: 'Amenity'
  }],
  media: {
    mainImage: {
      type: String,
      required: true
    },
    images: [String],
    virtualTour: String,
    floorPlan: String
  },
  availability: {
    status: {
      type: String,
      enum: ['immediate', 'from-date'],
      required: true
    },
    availableFrom: Date,
    minimumLeaseTerm: {
      type: Number,
      default: 1
    }
  },
  features: [String],
  buildingId: {
    type: ObjectId,
    ref: 'Building'
  },
  status: {
    type: String,
    enum: ['active', 'leased', 'maintenance'],
    default: 'active'
  }
}
```

### User Model Schema
```javascript
{
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    bcrypt: true // Automatically encrypted
  },
  role: {
    type: String,
    enum: ['admin', 'agent', 'client'],
    default: 'client'
  },
  profile: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: String,
    company: String,
    position: String,
    avatar: String
  },
  preferences: {
    propertyTypes: [String],
    priceRange: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    preferredLocations: [{
      city: String,
      district: String
    }],
    desiredSize: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['sq.ft', 'sq.m'],
        default: 'sq.ft'
      }
    },
    desiredAmenities: [{
      type: ObjectId,
      ref: 'Amenity'
    }]
  },
  savedProperties: [{
    type: ObjectId,
    ref: 'Property'
  }],
  notifications: {
    email: Boolean,
    propertyAlerts: Boolean,
    bookingUpdates: Boolean
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastLogin: Date,
  verificationStatus: {
    email: Boolean,
    phone: Boolean,
    documents: Boolean
  }
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

All error responses follow the format:
```json
{
  "message": "Error description"
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

The token is obtained from the login or register endpoints and expires after 24 hours.

## Database Indexes

The following indexes are implemented for optimized queries:

### User Indexes
- User email (unique)
- User role
- User status
- User first name and last name

### Property Indexes
- Location (city and district)
- Property type
- Property status
- Price amount
