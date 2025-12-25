# Tours Backend

Backend for Tours Management application built with Node.js, Express, and MongoDB.

## Prerequisites

- Docker
- Docker Compose

## Environment Variables

Before running the application, make sure to set the following environment variables in the `.env` file:

- `JWT_SECRET`: Secret key for JWT tokens
- `EMAIL_USER`: Email for sending notifications
- `EMAIL_PASS`: Email password
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `BACKEND_URL`: Backend URL (default: http://localhost:5000)
- `FRONTEND_URL`: Frontend URL (default: http://localhost:5173)
- `GUID_FRONTEND_URL`: Guide frontend URL (default: http://localhost:5174)
- `MANAGER_FRONTEND_URL`: Manager frontend URL (default: http://localhost:5173)

## Running with Docker

### Development Mode (Recommended for development)

1. Clone the repository and navigate to the backend directory.

2. Ensure your `.env` file contains all required environment variables.

3. Build and run the application in development mode:

   ```bash
   docker-compose up --build
   ```

4. The backend will be available at `http://localhost:5000`

5. **Code Changes**: When you make changes to the source code, the application will automatically restart thanks to nodemon and volume mounting. No need to rebuild the container!

6. MongoDB will be available at `mongodb://localhost:27017/tours_management`

### Production Mode

If you want to run in production mode (without development features):

1. Change the `command` in `docker-compose.yml` from `npm run dev` to `npm start`
2. Change `NODE_ENV` to `production`
3. Remove the source code volume mount (keep only the uploads volume)
4. Run: `docker-compose up --build`

**Note**: In production mode, you'll need to rebuild the container every time you make code changes.

### Stopping the Application

To stop the running containers:

```bash
docker-compose down
```

To stop and remove volumes (including MongoDB data):

```bash
docker-compose down -v
```

## API Endpoints

- Health check: `GET /api/health`
- Client auth: `/api/auth/*`
- Admin auth: `/api/admin/auth/*`
- Admin guides: `/api/admin/guides/*`
- Admin tours: `/api/admin/tours/*`
- Guide auth: `/api/guide/auth/*`
- Guide tours: `/api/guide/tours/*`

## File Uploads

Uploaded files are stored in the `public/uploads` directory and served statically.

## Development

For development without Docker:

1. Install dependencies: `npm install`
2. Set up your `.env` file with required environment variables
3. Run in development mode: `npm run dev`
4. Run in production mode: `npm start`
