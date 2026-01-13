# Green City Grow Hub - Backend API

A comprehensive REST API for the Green City Grow Hub platform, built with Node.js, Express, and PostgreSQL.

## Features

- **User Management**: Registration, authentication, profile management
- **Garden Management**: Create, join, and manage community gardens
- **Events**: Organize and manage gardening events
- **Discussions**: Community forum with threaded replies
- **Resources**: Educational content and guides
- **Photos**: User-shared garden photos
- **Statistics**: Track garden performance metrics
- **Authentication**: JWT-based authentication with role-based access control

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Language**: TypeScript
- **Security**: Helmet, CORS, Rate Limiting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd BackEnd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env` file and update the values:
   ```bash
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=green_city_grow_hub
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up the database**
   - Create a PostgreSQL database named `green_city_grow_hub`
   - Run the SQL scripts from `../database-setup.md` to create tables and populate sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (admin or self)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/:id/gardens` - Get user's gardens

### Gardens
- `GET /api/gardens` - Get all gardens
- `GET /api/gardens/:id` - Get garden by ID
- `POST /api/gardens` - Create new garden
- `PUT /api/gardens/:id` - Update garden
- `DELETE /api/gardens/:id` - Delete garden (soft delete)
- `POST /api/gardens/:id/join` - Join garden
- `POST /api/gardens/:id/leave` - Leave garden
- `GET /api/gardens/:id/members` - Get garden members

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/rsvp` - RSVP to event
- `GET /api/events/:id/attendees` - Get event attendees

### Discussions
- `GET /api/discussions` - Get all discussions
- `GET /api/discussions/:id` - Get discussion with replies
- `POST /api/discussions` - Create new discussion
- `PUT /api/discussions/:id` - Update discussion
- `DELETE /api/discussions/:id` - Delete discussion
- `POST /api/discussions/:id/replies` - Create reply
- `PUT /api/discussions/:discussionId/replies/:replyId` - Update reply
- `DELETE /api/discussions/:discussionId/replies/:replyId` - Delete reply

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get resource with guides
- `POST /api/resources` - Create new resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource
- `POST /api/resources/:id/guides` - Add guide to resource
- `PUT /api/resources/:resourceId/guides/:guideId` - Update guide
- `DELETE /api/resources/:resourceId/guides/:guideId` - Delete guide

### Photos
- `GET /api/photos` - Get all photos
- `GET /api/photos/:id` - Get photo by ID
- `POST /api/photos` - Upload new photo
- `PUT /api/photos/:id` - Update photo
- `DELETE /api/photos/:id` - Delete photo
- `GET /api/photos/user/:userId` - Get user's photos

### Stats
- `GET /api/stats/garden/:gardenId` - Get garden stats
- `POST /api/stats/garden/:gardenId` - Add new stat
- `PUT /api/stats/:statId` - Update stat
- `DELETE /api/stats/:statId` - Delete stat
- `GET /api/stats/dashboard/:gardenId` - Get dashboard stats

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

- **member**: Regular user
- **coordinator**: Garden coordinator
- **moderator**: Community moderator
- **admin**: Administrator

## Error Handling

The API returns standard HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

Error responses include a JSON object with an `error` field describing the issue.

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests (not implemented yet)

### Project Structure

```
BackEnd/
├── src/
│   ├── config/
│   │   └── database.ts          # Database connection
│   ├── middleware/
│   │   └── auth.ts              # Authentication middleware
│   ├── routes/
│   │   ├── auth.ts              # Authentication routes
│   │   ├── users.ts             # User management routes
│   │   ├── gardens.ts           # Garden management routes
│   │   ├── events.ts            # Event management routes
│   │   ├── discussions.ts       # Discussion forum routes
│   │   ├── resources.ts         # Educational resources routes
│   │   ├── photos.ts            # Photo sharing routes
│   │   └── stats.ts             # Statistics routes
│   └── server.ts                # Main server file
├── .env                         # Environment variables
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                    # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
