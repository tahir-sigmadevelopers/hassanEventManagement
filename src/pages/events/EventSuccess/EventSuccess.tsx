import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap'
import {
  BsCalendarCheck,
  BsClock,
  BsGeoAlt,
  BsPeople,
  BsPersonSquare,
  BsTelephone,
  BsCurrencyDollar,
} from 'react-icons/bs'
import { gql, useMutation } from '@apollo/client'
import { format } from 'date-fns'

// Mutation to get event details
const GET_EVENT = gql`
  mutation getEvent($id: ID!) {
    getEvent(id: $id) {
      id
      title
      start
      end
      description
      isPrivate
      venue
      hosted_by
      contact_number
      number_of_attendees
      speaker
      price
      isPaid
      createdBy {
        _id
        username
      }
    }
  }
`

const EventSuccess: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showContent, setShowContent] = useState(false)
  const [eventData, setEventData] = useState<any>(null)

  // Execute getEvent mutation instead of query
  const [getEvent, { loading, error }] = useMutation(GET_EVENT, {
    variables: { id },
    onCompleted: (data) => {
      setEventData(data.getEvent)
      console.log('Event data retrieved successfully:', data.getEvent)
      console.log('Price:', data.getEvent.price)
      console.log('Is Paid:', data.getEvent.isPaid)
      console.log(
        'Complete event details:',
        JSON.stringify(data.getEvent, null, 2),
      )
    },
  })

  // Fetch event details when component mounts
  useEffect(() => {
    getEvent()
  }, [getEvent])

  // Fade-in animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Container className='py-5 text-center'>
        <div className='spinner-border text-primary' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <p className='mt-3'>Loading event details...</p>
      </Container>
    )
  }

  if (error || !eventData) {
    return (
      <Container className='py-5 text-center'>
        <div className='alert alert-danger'>
          <p>
            Error loading event details. The event may have been removed or you
            don't have access.
          </p>
          {error && <p className='small mt-2'>Error: {error.message}</p>}
        </div>
        <Button variant='primary' onClick={() => navigate('/addEvent')}>
          Create Another Event
        </Button>
      </Container>
    )
  }

  const event = eventData

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'PPP p') // e.g., "Apr 29, 2022, 5:00 PM"
    } catch (e) {
      return dateStr
    }
  }

  console.log('Rendering event with price:', event.price)
  console.log('Event is paid:', event.isPaid)
  console.log('Price display section should show:', event.isPaid ? 'Yes' : 'No')

  return (
    <Container
      className={`py-5 fade-in ${showContent ? 'show' : ''}`}
      style={{
        opacity: showContent ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    >
      <Card className='border-0 shadow'>
        <Card.Header className='bg-success text-white py-3'>
          <div className='d-flex align-items-center'>
            <BsCalendarCheck size={24} className='me-2' />
            <h3 className='mb-0'>Event Created Successfully!</h3>
          </div>
        </Card.Header>

        <Card.Body className='p-4'>
          <h2 className='mb-4'>{event.title}</h2>

          <Row className='mb-4'>
            <Col md={8}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body>
                  <h4 className='mb-3'>Event Details</h4>

                  <div className='mb-3'>
                    <div className='d-flex align-items-center mb-2'>
                      <BsClock className='text-primary me-2' />
                      <strong>When:</strong>
                    </div>
                    <p className='ms-4 mb-1'>
                      Starts: {formatDate(event.start)}
                    </p>
                    <p className='ms-4 mb-0'>Ends: {formatDate(event.end)}</p>
                  </div>

                  <div className='mb-3'>
                    <div className='d-flex align-items-center mb-2'>
                      <BsGeoAlt className='text-primary me-2' />
                      <strong>Venue:</strong>
                    </div>
                    <p className='ms-4 mb-0'>{event.venue}</p>
                  </div>

                  <div className='mb-3'>
                    <div className='d-flex align-items-center mb-2'>
                      <BsPersonSquare className='text-primary me-2' />
                      <strong>Speaker:</strong>
                    </div>
                    <p className='ms-4 mb-0'>{event.speaker}</p>
                  </div>

                  <div className='mb-3'>
                    <div className='d-flex align-items-center mb-2'>
                      <BsPeople className='text-primary me-2' />
                      <strong>Capacity:</strong>
                    </div>
                    <p className='ms-4 mb-0'>
                      {event.number_of_attendees} attendees
                    </p>
                  </div>

                  <div className='mb-3'>
                    <div className='d-flex align-items-center mb-2'>
                      <BsTelephone className='text-primary me-2' />
                      <strong>Contact:</strong>
                    </div>
                    <p className='ms-4 mb-0'>{event.contact_number}</p>
                  </div>

                  {event.isPaid && (
                    <div className='mb-3'>
                      <div className='d-flex align-items-center mb-2'>
                        <BsCurrencyDollar className='text-primary me-2' />
                        <strong>Registration Fee:</strong>
                      </div>
                      <p className='ms-4 mb-0'>
                        ${Number(event.price).toFixed(2)}
                      </p>
                    </div>
                  )}

                  {event.isPrivate && (
                    <Badge bg='warning' text='dark' className='mt-2'>
                      Private Event
                    </Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className='h-100 border-0 shadow-sm'>
                <Card.Body>
                  <h4 className='mb-3'>Description</h4>
                  <p>{event.description || 'No description provided.'}</p>

                  <hr className='my-4' />

                  <h5 className='mb-3'>Hosted By</h5>
                  <p>{event.hosted_by}</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className='d-flex justify-content-center gap-3 mt-4'>
            <Button
              variant='primary'
              onClick={() => navigate(`/sharedEvent/${event.id}`)}
            >
              View Event Page
            </Button>
            <Button variant='success' onClick={() => navigate('/addEvent')}>
              Create Another Event
            </Button>
            <Button
              variant='outline-secondary'
              onClick={() => navigate('/calendar')}
            >
              Go to Calendar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default EventSuccess
