import { Link, useNavigate, useParams } from 'react-router-dom';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchEventDetails, updateEvent } from '../../util/http.js';

export default function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventDetails(id),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      navigate('/');
    }
  })

  function handleSubmit(formData) {
    mutate({ event: formData, id });
  }

  function handleClose() {
    navigate('../');
  }

  return (
    <Modal onClose={handleClose}>
      <EventForm inputData={data} onSubmit={handleSubmit}>
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
    </Modal>
  );
}
