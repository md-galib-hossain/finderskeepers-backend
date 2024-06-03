# Lost & Found System

Welcome to the Finders Keepers System! This project is a community-driven platform designed to help individuals report and reclaim lost items. By facilitating the reporting of both lost and found items, the platform aims to create a seamless process for reuniting people with their belongings.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Usage](#usage)
- [Additional Notes](#additional-notes)

## Introduction

The Finders Keepers System is built with modern web technologies to ensure a user-friendly experience for reporting and reclaiming lost items. The platform includes features for reporting items, verifying ownership, managing user profiles, and providing administrative tools for overseeing site activity and user management.

## Features

- **User Authentication and Authorization**: Secure login and registration.
- **Item Reporting**: Report lost and found items with detailed descriptions and images.
- **Profile Management**: Manage user profiles, claim requests, and reported items.
- **Admin Dashboard**: User management, activity monitoring, and item category management.
- **Search and Filter**: Search and filter recent posts by category, location, name & description.
- **Ownership Verification**: Mechanisms to verify ownership of found items.

## Technologies Used

### Frontend

- **Next.js**: React framework for server-rendered applications.
- **Material UI**: Component library for React.
- **TypeScript**: Programming language for type safety.
- **Axios**: Promise-based HTTP client.
- **Redux**: State management.
- **React Hook Form**: Form management library.

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework.
- **TypeScript**: Programming language for type safety.
- **PostgreSQL**: Relational database.
- **Prisma**: ORM for database management.
- **Supabase**: Backend as a service (BaaS) for database.
- **Zod**: TypeScript-first schema declaration and validation library.
- **bcrypt**: Library for hashing passwords.
- **JWT**: JSON Web Token for authentication.

## Prerequisites

Before running the project locally, ensure you have the following installed:

- Node.js
- PostgreSQL
- Prisma CLI (Install globally with `npm install -g prisma`)

## Getting Started

### Environment Variables

To run this project locally, you need to set up the following environment variables:

Create a `.env` file in the root directory for both frontend and backend, and add these variables with the specified values.

#### Backend Environment Variables

DATABASE_URL=postgres://username

NODE_ENV=development
PORT=5000
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=30d
RESET_PASSWORD_TOKEN=your_reset_password_token
RESET_PASSWORD_TOKEN_EXPIRES_IN=5m
RESET_PASSWORD_LINK=http://localhost:5000/reset-pass

#### Frontend Environment Variables
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api
NEXT_PUBLIC_Imgbb_Token=your_imgbb_token

### Frontend Setup

1. Clone the repository to your local machine.
2. Navigate to the `frontend` directory.
3. Install dependencies by running `npm install`.
4. Run the development server using `npm run dev`.

### Backend Setup

1. Clone the repository to your local machine.
2. Navigate to the `backend` directory.
3. Install dependencies by running `npm install`.
4. Run Prisma migrations to set up the database schema and generate Prisma client by executing `npx prisma migrate dev`.
5. Start the server using `npm run start:dev`.

## Usage

Once the server is running, you can access the application locally:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

You can test the endpoints using tools like Postman or by integrating them with the frontend application.

## Additional Notes

- **Authentication**: Due to limitations on free hosting, refresh token authentication is not available in this project. Only access token is used, and if it expires, you will be logged out automatically.
- **GitHub Repositories**:
  - Backend: [Finders Keepers Backend](https://github.com/md-galib-hossain/finderskeepers-backend)
  - Frontend: [Finders Keepers Frontend](https://github.com/md-galib-hossain/finderskeepers-frontend)
- **Live Sites**:
  - Frontend: [Finders Keepers Frontend Live Site](https://finderskeepers-frontend.vercel.app/)
  - Backend: [Finders Keepers Backend Live Site](https://finderskeepers-backend.onrender.com)
- **Video Demo**: [Watch the demo](https://drive.google.com/file/d/1Uc7fH8nCvRMa3jItDVsBItDMl-ubfvps/view?usp=sharing)

## Credentials

- **Admin Role Account**: 
  - Email: admin@gmail.com
  - Password: 123456  
- **User Role Accounts**: 
  - Email: test@gmail.com
  - Password: 123456
  - Email: test1@gmail.com
  - Password: 123456
  - Email: test3@gmail.com
  - Password: 123456
