import React, { FC, useState, useEffect } from 'react'
import { Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useRegisterForEventMutation } from '../../interfaces/graphql-types'
import { useChatBot } from '../ChatBot/ChatBotProvider'
import StripeProvider from '../PaymentForm/StripeProvider'
import PaymentForm from '../PaymentForm/PaymentForm'

interface EventRegistrationProps {
  eventId: string
  availableSpots: number | undefined | null
  onSuccess?: () => void
  eventTitle?: string
  isPaid?: boolean
  price?: number | null
}

const EventRegistration: FC<EventRegistrationProps> = ({
  eventId,
  availableSpots,
  onSuccess,
  eventTitle = 'this event',
  isPaid = false,
  price = 0,
}) => {
  // Debug log to see received values
  console.log('EventRegistration component received:', {
    eventId,
    isPaid,
    price,
    eventTitle,
    availableSpots,
    isPaidType: typeof isPaid,
    priceType: typeof price,
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)
  const { notifyRegistrationComplete } = useChatBot()

  const [registerForEvent, { loading }] = useRegisterForEventMutation({
    onError: (error) => {
      setError(error.message)
      setSuccess(false)
    },
    onCompleted: () => {
      setSuccess(true)
      setError(null)
      // Reset form
      setName('')
      setEmail('')
      setPhone('')
      setAdditionalInfo('')

      // Notify chatbot of successful registration
      notifyRegistrationComplete(eventTitle)

      if (onSuccess) {
        onSuccess()
      }
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    console.log('Form submitted, validating fields...')

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in all required fields')
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    // Simple phone validation (at least 10 digits)
    const phoneRegex = /^\d{10,}$/
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number (at least 10 digits)')
      return
    }

    // If this is a paid event, show payment form
    if (isPaid && price && price > 0) {
      console.log('Paid event detected, showing payment form...')
      setShowPayment(true)
      return
    }

    console.log('Free event or payment completed, processing registration...')
    // If free event or payment is complete, complete registration
    await completeRegistration()
  }

  const completeRegistration = async () => {
    console.log('Starting registration process with data:', {
      name,
      email,
      phone,
      eventId,
      paymentIntentId,
    })
    
    try {
      const result = await registerForEvent({
        variables: {
          attendee: {
            name,
            email,
            phone,
            event: eventId,
            additionalInfo: additionalInfo || undefined,
            paymentIntentId: paymentIntentId || undefined,
          },
        },
      })
      
      console.log('Registration completed successfully:', result)
    } catch (error) {
      console.error('Registration error:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      throw error; // Re-throw to allow caller to handle
    }
  }

  const handlePaymentSuccess = async (intentId: string) => {
    console.log('Payment successful with intent ID:', intentId)
    setPaymentIntentId(intentId)
    setPaymentComplete(true)
    setShowPayment(false)

    try {
      // Complete the registration with payment information
      console.log('Completing registration with payment...')
      await completeRegistration()
    } catch (err) {
      console.error('Error completing registration after payment:', err)
      setError('Payment was successful, but there was an error completing your registration. Please contact the event organizer.')
    }
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
  }

  // Use a variable to safely check for capacity
  const isAtCapacity = typeof availableSpots === 'number' && availableSpots <= 0
  if (isAtCapacity) {
    return (
      <Alert variant='warning'>
        This event is at full capacity. Registration is closed.
      </Alert>
    )
  }

  if (success) {
    return (
      <Alert variant='success'>
        Thank you for registering! We've sent a confirmation to your email.
        {isPaid && paymentComplete && (
          <div className='mt-2'>
            Your payment has been successfully processed.
          </div>
        )}
      </Alert>
    )
  }

  // Use another variable to safely check for displaying spots
  const hasAvailableSpots =
    typeof availableSpots === 'number' && availableSpots > 0

  // If showing payment form
  if (showPayment) {
    const attendeeData = { name, email, phone }

    return (
      <StripeProvider>
        <div className='event-registration-form mt-4'>
          <h3>Payment for {eventTitle}</h3>

          <PaymentForm
            amount={Number(price) || 0}
            eventId={eventId}
            eventTitle={eventTitle}
            attendeeData={attendeeData}
            onSuccess={handlePaymentSuccess}
            onCancel={handlePaymentCancel}
          />

          <div className='test-card-info mt-3'>
            <h5>Test Card Details</h5>
            <p>Use these test card details for payment:</p>
            <ul>
              <li>Card number: 4242 4242 4242 4242</li>
              <li>Expiry date: Any future date (e.g., 12/25)</li>
              <li>CVC: Any 3 digits (e.g., 123)</li>
              <li>ZIP: Any 5 digits (e.g., 12345)</li>
            </ul>
          </div>
        </div>
      </StripeProvider>
    )
  }

  return (
    <div className='event-registration-form mt-4'>
      <h3>Register for this Event</h3>
      {hasAvailableSpots && (
        <p className='text-muted'>
          {availableSpots} {availableSpots === 1 ? 'spot' : 'spots'} available
        </p>
      )}

      {/* Display payment information */}
      <div className='registration-payment-info mb-3'>
        {isPaid ? (
          <Alert variant='info'>
            <strong>Registration Fee:</strong> ${Number(price).toFixed(2)}
            <div className='small mt-1'>
              You'll be asked to complete payment after submitting your
              registration details.
            </div>
          </Alert>
        ) : (
          <Alert variant='success'>
            <strong>Free Event</strong> - No registration fee required
          </Alert>
        )}
      </div>

      {error && <Alert variant='danger'>{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>
                Name <span className='text-danger'>*</span>
              </Form.Label>
              <Form.Control
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Your full name'
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>
                Email <span className='text-danger'>*</span>
              </Form.Label>
              <Form.Control
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Your email address'
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className='mb-3'>
          <Form.Label>
            Phone <span className='text-danger'>*</span>
          </Form.Label>
          <Form.Control
            type='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='Your phone number'
            required
          />
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label>Additional Information</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Any additional information you'd like to provide"
          />
        </Form.Group>

        <Button variant='primary' type='submit' disabled={loading}>
          {loading
            ? 'Processing...'
            : isPaid
            ? 'Continue to Payment'
            : 'Register Now'}
        </Button>
      </Form>
    </div>
  )
}

export default EventRegistration
