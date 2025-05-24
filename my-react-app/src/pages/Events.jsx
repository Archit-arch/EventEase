import { Link } from "react-router-dom";
import Footer from '../components/Footer/Footer.jsx';

const Events = () => {
  const eventList = [
    { id: 1, name: "Tech Conference 2025" },
    { id: 2, name: "Music Fest 2025" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Upcoming Events</h2>
      <ul>
        {eventList.map(event => (
          <li key={event.id}>
            <Link to={`/events/${event.id}`} className="text-blue-500">{event.name}</Link>
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default Events;
