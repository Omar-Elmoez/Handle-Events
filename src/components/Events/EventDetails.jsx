import { Link, useNavigate, Outlet, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEventDetails } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import getHostName from '../../util/getHostName.js';
import Modal from '../UI/Modal.jsx';
import { useState } from 'react';

export default function EventDetails() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate();
  const { id } = useParams();
  const hostName = getHostName();

  const { data: event, isPending, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEventDetails(id),
  })

  const formattedDate = new Date(event?.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const { mutate, isPending: isPendingDelete, isError: isErrorDelete, error: errorDelete } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      navigate('/')
    }
  })
  const handleDelete = () => {
    mutate(id)
  }

  const handleShowModal = () => {
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      {showModal && !isPendingDelete && <Modal onClose={handleClose}>
        <h2>Are you sure?</h2>
        <p>Do you really want to delete this event? This action cannot be undone.</p>
        <div className="form-actions">
          <button onClick={handleClose} className='button-text'>Cancel</button>
          <button onClick={handleDelete} className="button">Delete</button>
        </div>
        {isErrorDelete && <ErrorBlock title="An error occurred" message={errorDelete.info?.message || "Failed to delete Event."} />}
      </Modal>}
      <Outlet />
      <Header>
        <Link to="/" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isPending && <p className='event-details-pending'>Fetching event details...</p>}
      {isPendingDelete && <div className='event-details-loading'><LoadingIndicator /></div>}
      {event && !isPendingDelete && <article id="event-details">
        <header>
          <h1>{event?.title}</h1>
          <nav>
            <button onClick={handleShowModal}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`${hostName}/${event?.image}`} alt="event-image" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{event?.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {event?.time}</time>
            </div>
            <p id="event-details-description">{event?.description}</p>
          </div>
        </div>
      </article>}
      {isError && <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch Event Details."} />}
    </>
  );
}
