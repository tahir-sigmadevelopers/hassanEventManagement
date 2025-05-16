import React from 'react'
import { Form, InputGroup } from 'react-bootstrap'

interface EventPriceFieldProps {
  isPaid: boolean
  price: number
  onIsPaidChange: (isPaid: boolean) => void
  onPriceChange: (price: number) => void
  disabled?: boolean
}

const EventPriceField: React.FC<EventPriceFieldProps> = ({
  isPaid,
  price,
  onIsPaidChange,
  onPriceChange,
  disabled = false,
}) => {
  return (
    <div className='event-price-field'>
      <div className='mb-3'>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            id='isPaidCheck'
            checked={isPaid}
            onChange={(e) => onIsPaidChange(e.target.checked)}
            disabled={disabled}
          />
          <label className='form-check-label' htmlFor='isPaidCheck'>
            This is a paid event
          </label>
        </div>
      </div>

      {isPaid && (
        <div className='mb-3'>
          <Form.Label htmlFor='price'>Registration Fee ($)</Form.Label>
          <InputGroup>
            <InputGroup.Text>$</InputGroup.Text>
            <Form.Control
              type='number'
              id='price'
              placeholder='0.00'
              value={price}
              min={0}
              step={0.01}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              disabled={disabled}
            />
          </InputGroup>
          <Form.Text className='text-muted'>
            Enter the registration fee in USD (e.g., 10.00)
          </Form.Text>
        </div>
      )}
    </div>
  )
}

export default EventPriceField
