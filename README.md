# Event Management System

A comprehensive event management application for creating, managing, and registering for events with integrated payment processing.

## Tech Stack

### Frontend

- React (with Hooks)
- TypeScript
- Bootstrap/react-bootstrap
- Styled Components
- Apollo Client
- Stripe Payment Integration
- FullCalendar

### Backend

- Node.js with Express
- TypeScript
- Apollo Server Express
- GraphQL
- JSON Web Token
- MongoDB with Mongoose
- Stripe API

## Features

- **User Authentication**: Sign up, login, and user session management
- **Event Management**: Create, update, and delete events
- **Advanced Calendar**: View events in daily, weekly, or monthly calendar views
- **Event Registration**: Register for events with a complete registration flow
- **Payment Processing**: Integrated Stripe payment for paid events
- **Attendee Management**: Track and manage event attendees
- **Event Statistics**: View registration and attendance statistics
- **Rating System**: Allow attendees to rate and provide feedback for events
- **Search & Filtering**: Search events by title, filter by date, status, etc.
- **Privacy Controls**: Private events visible only to creators
- **Responsive Design**: Works on desktop and mobile devices
- **Social Sharing**: Share events with family & friends on social platforms

## Payment Integration

This project uses Stripe for processing payments for paid events. To set up the payment system:

1. Follow the instructions in [STRIPE_SETUP.md](./STRIPE_SETUP.md) to configure your environment
2. Set up the required environment variables for Stripe API keys
3. Test the payment flow using Stripe's test card numbers

## Installation and Setup

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas connection)
- Stripe account for payment processing

### Installation

1. Clone the repository:
```
git clone https://github.com/tahir-sigmadevelopers/hassanEventManagement.git
cd hassanEventManagement
```

2. Install dependencies:
```
npm install -f
```

3. Create a `.env` file in the project root with the following:
```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Stripe API Keys
STRIPE_SECRET=your_stripe_secret_key
REACT_APP_STRIPE_PUBLIC=your_stripe_publishable_key
```

### Running the Application

In the project directory, run:

```
npm start
```

This runs both backend and frontend applications simultaneously in development mode.

Alternatively, you can run the applications separately:
- Frontend only: `npm start:web`
- Backend only: `npm start:server`

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## GraphQL Schema Generation

This project uses [GraphQL Code Generator](https://www.graphql-code-generator.com/docs/getting-started) to generate TypeScript types for GraphQL schemas.

If you make changes to the schema (server/graphql/schema/index.ts), update the `.graphql` files in the frontend accordingly, then run:

```
npm codegen
```

Note: Ensure the server is running before generating code.

## Testing

For testing the payment integration, use Stripe's test card numbers:
- Card number: `4242 4242 4242 4242`
- Expiry date: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits
