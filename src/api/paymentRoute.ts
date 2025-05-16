import express from 'express'
import { createPaymentIntent, confirmPayment } from './stripe'
import { toCents } from '../utils/stripe'

const router = express.Router()

// Create a payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, eventId, eventTitle, attendeeData } = req.body

    if (!amount || !eventId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    // Convert amount to cents for Stripe
    const amountInCents = toCents(parseFloat(amount))

    // Add metadata for the payment
    const metadata = {
      eventId,
      eventTitle,
      attendeeName: attendeeData?.name,
      attendeeEmail: attendeeData?.email,
    }

    const result = await createPaymentIntent(amountInCents, metadata)

    if (result.success) {
      return res.json(result)
    } else {
      return res.status(400).json(result)
    }
  } catch (error) {
    console.error('Payment intent error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    })
  }
})

// Confirm payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId } = req.body

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required',
      })
    }

    const result = await confirmPayment(paymentIntentId)

    if (result.success) {
      return res.json(result)
    } else {
      return res.status(400).json(result)
    }
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Server error',
    })
  }
})

export default router
