import { ChangeEvent, Fragment, useContext, useState } from 'react'
import { MdSaveAlt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import EventBody from '../../../components/EventBody/EventBody'
import Alert from '../../../components/UI/Alert/Alert'
import AuthContext from '../../../store/auth-context'
import {
  SaveEventMutation,
  useSaveEventMutation,
} from '../../../generated/graphql'
import { IAuth } from '../../../types'
import { ApolloError } from '@apollo/client'
import { BtnSpinner } from '../../../components/UI/BtnSpinner/BtnSpinner'
import { Button } from 'react-bootstrap'
import LoginContainer from '../../user/LoginContainer/LoginContainer'

const initEvent = {
  title: '',
  start: '',
  end: '',
  isPrivate: false,
  description: '',
  venue: '',
  hosted_by: '',
  contact_number: '',
  number_of_attendees: 0,
  speaker: '',
  isPaid: false,
  price: 0,
}

function AddEvent() {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [event, setEvent] = useState({ ...initEvent })
  const [resetForm, setResetForm] = useState(false)
  const [disableSaveBtn, setDisableSaveBtn] = useState(true)

  const {
    title,
    start,
    end,
    isPrivate,
    description,
    venue,
    hosted_by,
    contact_number,
    number_of_attendees,
    speaker,
    isPaid,
    price,
  } = event

  const [saveEvent, { error, data, loading, reset }] = useSaveEventMutation({
    variables: {
      event: {
        id: '',
        title,
        start,
        end,
        isPrivate,
        description,
        venue,
        hosted_by,
        contact_number,
        number_of_attendees: Number(number_of_attendees),
        speaker,
        isPaid,
        price: Number(price),
      },
    },
  })

  const { auth } = useContext(AuthContext)

  const handleOnSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    reset()
    setResetForm(false)

    console.log('Saving event with price:', price)
    console.log('Event is paid:', isPaid)
    console.log('Full event data:', {
      id: '',
      title,
      start,
      end,
      isPrivate,
      description,
      venue,
      hosted_by,
      contact_number,
      number_of_attendees: Number(number_of_attendees),
      speaker,
      isPaid,
      price: Number(price),
    })

    saveEvent()
      .then(async (result) => {
        console.log('Save event result:', result)
        console.log('Saved event price:', result.data?.saveEvent?.price)
        console.log('Saved event isPaid:', result.data?.saveEvent?.isPaid)

        if (result.data?.saveEvent?.id) {
          // If we got an event ID, navigate to the success page
          navigate(`/event-success/${result.data.saveEvent.id}`)
        } else {
          // Fallback to old behavior if we don't have an ID
          setEvent({
            ...initEvent,
            number_of_attendees: Number(initEvent.number_of_attendees),
          })
          setResetForm(true)
          setDisableSaveBtn(true)
        }
      })
      .catch((error) => console.error(error.message))
  }

  const onChangeValueHandler = (prop: string, value: string | boolean) => {
    setEvent({ ...event, [prop]: value })
  }

  return (
    <Fragment>
      {showModal && (
        <LoginContainer view={'Login'} onClose={() => setShowModal(false)} />
      )}
      <CustomAlert
        auth={auth}
        data={data}
        error={error}
        onClose={reset}
        onLogin={() => setShowModal(true)}
      />
      <form className='row g-3' onSubmit={handleOnSubmit}>
        <div className='col-12'>
          <EventBody
            event={event}
            disableEdit={!auth || loading}
            resetForm={resetForm}
            onChangeValue={(prop, value) => onChangeValueHandler(prop, value)}
            onValidate={(valid) => setDisableSaveBtn(!valid)}
          />
        </div>

        <div className='col-12 mt-4'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={disableSaveBtn || loading || !auth}
          >
            {loading && <BtnSpinner />} Save <MdSaveAlt />
          </button>
        </div>
      </form>
    </Fragment>
  )
}

const CustomAlert = ({
  auth,
  data,
  error,
  onClose,
  onLogin,
}: {
  auth: IAuth | null
  data: SaveEventMutation | null | undefined
  error: ApolloError | undefined
  onClose: () => void
  onLogin: () => void
}) =>
  !auth ? (
    <Alert
      msg='You must login to be able to add events.'
      type='warning'
      dismissible={false}
      btn={
        <Button variant='primary' size='sm' type='button' onClick={onLogin}>
          Login
        </Button>
      }
    />
  ) : data ? (
    <Alert
      data-testid='success-alert'
      msg='Event was successfully added.'
      type='success'
      onClose={onClose}
    />
  ) : error ? (
    <Alert
      msg='Error occurred while saving event! Please try again later.'
      type='danger'
      onClose={onClose}
    />
  ) : null

export default AddEvent
