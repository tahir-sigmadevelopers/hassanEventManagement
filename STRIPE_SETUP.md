# Stripe Payment Integration Setup

This document explains how to set up Stripe for the event registration payment system.

## Environment Variables

To use Stripe payments securely, you need to set up environment variables instead of hardcoding API keys in your code. This prevents exposing sensitive keys in your repository.

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Stripe API Keys
STRIPE_SECRET=sk_test_your_secret_key_here
REACT_APP_STRIPE_PUBLIC=pk_test_your_publishable_key_here
```

### For Production

In production, never commit the `.env` file to your repository. Instead:

1. Add `.env` to your `.gitignore` file
2. Set environment variables on your hosting platform (e.g., Heroku, Vercel, Netlify)

## Using Stripe Test Mode

When testing payments:

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Make sure you're in test mode (toggle in the dashboard)
3. Use the test API keys provided by Stripe
4. Use Stripe's test credit card numbers for testing:
   - Card number: `4242 4242 4242 4242`
   - Expiry date: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

## Securing API Keys

Always remember:

- Never commit API keys directly in your code
- Use environment variables for all sensitive information
- Restrict API key permissions in the Stripe dashboard
- Regularly rotate your API keys

## Testing the Integration

After setting up your environment variables, you can test the payment integration by:

1. Creating a new paid event
2. Setting a price
3. Registering for the event
4. Using Stripe test cards to complete payment

Remember that all payments made with test API keys won't result in actual charges. 