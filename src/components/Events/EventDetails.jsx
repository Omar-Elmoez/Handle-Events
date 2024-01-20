import { Link, useNavigate, Outlet, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEventDetails } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: event, isPending, isError, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventDetails(id),
  })

  const { mutate, isPending: isPendingDelete } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      navigate('../')
    }
  })
  const handleDelete = (id) => {
    mutate(id)
  }

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      {isPending && <p>Fetching event details...</p>}
      {isPendingDelete && <LoadingIndicator />}
      {event && !isPendingDelete && <article id="event-details">
        <header>
          <h1>{event?.title}</h1>
          <nav>
            <button onClick={() => handleDelete(event?.id)}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${event?.image}`} alt="event-image" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{event?.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{event?.date} {event?.time}</time>
            </div>
            <p id="event-details-description">{event?.description}</p>
          </div>
        </div>
      </article>}
      {isError && <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to fetch Event Details."} />}
    </>
  );
}
