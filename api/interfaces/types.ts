import { Types } from 'mongoose'

export interface IEvent {
  id?: string
  title: string
  start: string
  end: string
  description: string
  url: string
  isPrivate: boolean
  createdBy: Types.ObjectId
  venue: string
  speaker: string
  hosted_by: string
  number_of_attendees: number
  contact_number: string
  price?: number
  isPaid?: boolean
}

export interface IAttendee {
  id?: string
  name: string
  email: string
  phone: string
  event: Types.ObjectId
  status: 'registered' | 'attended' | 'cancelled'
  additionalInfo?: string
  paymentIntentId?: string
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded' | 'none'
}

export interface IUser {
  username: string
  password: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  bio: string
  createdEvents: Types.ObjectId[]
}

export interface IAuth {
  userId: string
  username: string
  token: string
  tokenExpiration?: number
}

export interface IContext {
  auth?: IAuth
}

export interface IAuthParams {
  isAuthorized: boolean
  userId: string
}
