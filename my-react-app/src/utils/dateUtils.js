// src/utils/dateUtils.js
export const isUpcoming = (evt) => {
  if (!evt.date || !evt.start_time) return false;
  const [h, m, s = "00"] = evt.start_time.split(":");
  const eventDate = new Date(evt.date);
  eventDate.setHours(+h, +m, +s, 0);
  return eventDate > new Date();
};

export const isPast = (evt) => {
  if (!evt.date || !evt.start_time) return false;
  const [h, m, s = "00"] = evt.start_time.split(":");
  const eventDate = new Date(evt.date);
  eventDate.setHours(+h, +m, +s, 0);
  return eventDate <= new Date();
};
