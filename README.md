# Tripma - Flight Booking Platform

Tripma is a modern flight booking and travel management platform built with Next.js and Payload CMS.

## Features

- **Google OAuth Integration**: Seamless login with Google, integrated with Payload CMS sessions.
- **Flight Search**: Real-time flight search and selection.
- **Seat Selection**: Interactive seat map with class-based pricing.
- **Passenger Management**: Secure handling of traveler information.
- **Booking History**: Users can view and manage their previous trips.
- **Payload CMS Backend**: Powerful admin dashboard for managing flights, stays, testimonials, and users.

## Quick Start - Local Setup

1. **Environment Variables**:
   Copy `.env.example` to `.env` and fill in the required variables:
   - `DATABASE_URL`: Your MongoDB connection string.
   - `PAYLOAD_SECRET`: A secret string for Payload sessions.
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID.
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth Client Secret.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

4. **Admin Dashboard**:
   Access the Payload admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

## Database Seeding

To quickly populate the database with sample flights, stays, and deals, run the following command or visit the endpoint:
```bash
curl -X POST http://localhost:3000/api/seed
```

## Promoting a User to Admin

To promote a user to an admin role:
```bash
curl "http://localhost:3000/api/promote?email=user@example.com"
```

## Technologies Used

- **Framework**: Next.js 15
- **CMS**: Payload CMS 3.0
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Authentication**: Google OAuth + Payload Auth
- **Icons**: React Icons
