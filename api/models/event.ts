import { Schema, model } from 'mongoose'
import { IEvent } from '../interfaces/types'

const schema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    isPrivate: {
      type: Boolean,
      required: false,
    },
    venue: {
      type: String,
      required: true,
    },
    speaker: {
      type: String,
      required: true,
    },

    number_of_attendees: {
      type: Number,
      required: true,
    },
    hosted_by: {
      type: String,
      required: true,
    },
    contact_number: {
      type: String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    price: {
      type: Number,
      required: false,
      default: 0,
    },
    isPaid: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual for attendees
schema.virtual('attendees', {
  ref: 'Attendee',
  localField: '_id',
  foreignField: 'event',
})

// Virtual for available spots
schema.virtual('availableSpots').get(function (this: any) {
  return Math.max(0, this.number_of_attendees - (this.attendees?.length || 0))
})

export const EventModel = model<IEvent>('Event', schema)
