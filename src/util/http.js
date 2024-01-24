import { QueryClient } from "@tanstack/react-query";
import getHostName from "./getHostName";

export const queryClient = new QueryClient();

const hostName = getHostName();
export async function fetchEvents({ signal, searchTerm, max }) {


  let url = `${hostName}/events`;

  if (searchTerm) {
    url += `?search=${searchTerm}`;
  }

  if (max) {
    url += `?max=${max}`
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent(eventData) {

  const response = await fetch(`${hostName}/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function fetchEventsImages() {
  const response = await fetch(`${hostName}/events/images`);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events images");
    error.info = await response.json();
    error.code = response.status;
    throw error;
  }

  const { images } = await response.json();

  return images;
}

export async function fetchEventDetails(id) {
  const response = await fetch(`${hostName}/events/${id}`);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the event details");
    error.info = await response.json();
    error.code = response.status;
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteEvent(id) {
  const response = await fetch(`${hostName}/events/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the event");
    error.info = await response.json();
    error.code = response.status;
    throw error;
  }

  const {message} = await response.json();

  return message;
}

export async function updateEvent(newData) {
  const response = await fetch(`${hostName}/events/${newData.id}`, {
    method: "PUT",
    body: JSON.stringify(newData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the event details");
    error.info = await response.json();
    error.code = response.status;
    throw error;
  }

  const { event } = await response.json();

  return event;
}
