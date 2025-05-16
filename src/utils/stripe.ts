import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with the public key from environment variables
export const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC || ''
)

// Format price for display
export const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return '$0.00'
  return `$${(price / 100).toFixed(2)}`
}

// Convert dollar amount to cents for Stripe
export const toCents = (amount: number): number => {
  return Math.round(amount * 100)
}
