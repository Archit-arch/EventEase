import { useParams } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Event Details</h2>
      <p>Details for event ID: {id}</p>
    </div>
  );
};

export default EventDetails;
