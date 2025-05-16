import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button, Alert, Spinner } from 'react-bootstrap'
import './PaymentForm.css'

interface PaymentFormProps {
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onCancel: () => void
  eventId: string
  eventTitle: string
  attendeeData: {
    name: string
    email: string
    phone: string
  }
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onCancel,
  eventId,
  eventTitle,
  attendeeData,
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [clientSecret, setClientSecret] = useState('')

  // Format the amount as a dollar value
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

  // Create a payment intent when the component mounts
  React.useEffect(() => {
    // Only create the payment intent if amount is valid
    if (amount <= 0) return

    const createIntent = async () => {
      try {
        console.log('Creating payment intent for amount:', amount)
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            eventId,
            eventTitle,
            attendeeData,
          }),
        })

        console.log('Response status:', response.status)
        const data = await response.json()
        console.log('Payment intent response:', data)

        if (data.success) {
          setClientSecret(data.clientSecret)
        } else {
          setError(data.error || 'Could not create payment intent')
        }
      } catch (err) {
        console.error('Network error creating payment intent:', err)
        setError('Network error. Please try again.')
      }
    }

    createIntent()
  }, [amount, eventId, eventTitle, attendeeData])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card element not found')
      return
    }

    setProcessing(true)
    setError(null)

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: attendeeData.name,
              email: attendeeData.email,
            },
          },
        },
      )

      if (error) {
        setError(error.message || 'Payment failed')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        onSuccess(paymentIntent.id)
      } else {
        setError('Payment could not be processed. Please try again.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className='payment-form-container'>
      <h4>Payment Details</h4>
      <p>Amount: {formattedAmount}</p>

      {error && <Alert variant='danger'>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <div className='card-element-container'>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>

        <div className='button-container'>
          <Button variant='secondary' onClick={onCancel} disabled={processing}>
            Cancel
          </Button>
          <Button
            variant='primary'
            type='submit'
            disabled={!stripe || processing || !clientSecret}
          >
            {processing ? (
              <>
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
                />{' '}
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PaymentForm
