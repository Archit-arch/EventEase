import Carousel from 'react-bootstrap/Carousel';

function DarkVariantExample() {
  const imageStyle = {
    height: '350px',
    objectFit: 'cover',
    width: '100%',
  };

  const captionStyle = {
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: '10px',
    borderRadius: '5px',
  };

  return (
    <Carousel 
      style={{ maxWidth: '900px', margin: '0 auto' }}
      data-bs-theme="dark"
      interval={3000} // 3 seconds
      controls={true}
      indicators={true}
      fade={false} // Set to true for crossfade effect
    >
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/event-1.jpg"
          alt="First slide"
          style={imageStyle}
        />
        <Carousel.Caption style={captionStyle}>
          <h5>Explore Events</h5>
          <p>Search and find events happening on your campus.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/event-3.jpg"
          alt="Second slide"
          style={imageStyle}
        />
        <Carousel.Caption style={captionStyle}>
          <h5>Join or RSVP</h5>
          <p>Secure your spot with one click.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/event-4.jpg"
          alt="Third slide"
          style={imageStyle}
        />
        <Carousel.Caption style={captionStyle}>
          <h5>Organize Effortlessly</h5>
          <p>Create your own event and manage attendees.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default DarkVariantExample;
