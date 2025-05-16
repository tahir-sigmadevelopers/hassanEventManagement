import { loadStripe } from '@stripe/stripe-js'

// Initialize Stripe with the public key
export const stripePromise = loadStripe(
  'pk_test_51M6G7SDTWOMiftC1wMoUqyE4s1YsYdTEIik7Q4qxSSRQYU1bleKeFvgzsRIiqoAU1o6MOV83tRfUlxZHqKdhhRFo00Y5aCYZZH',
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
