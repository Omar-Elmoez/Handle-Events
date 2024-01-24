import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEventDetails, queryClient, updateEvent } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isPending: isPendingFetch, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: () => fetchEventDetails(id),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events']});
      navigate('../');
    }
  })

  function handleSubmit(formData) {
    mutate({ event: formData, id });
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if (isPendingFetch) {
    content = <div className='event-details-loading'><LoadingIndicator /></div>
  }

  if (isError) {
    content = <>
      <ErrorBlock title="An error occurred" message={error.info?.message || "Failed to load Event. Please check your inputs and try again later"} />
      <div className='form-action'>
        <Link to="../" className="button">
          Cancel
        </Link>
      </div>
    </>
  }

  if (data) {
    content = <EventForm inputData={data} onSubmit={handleSubmit}>
      {isPending && "Updating...."}
      {!isPending && <>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </>}
    </EventForm>
  }

  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
}
