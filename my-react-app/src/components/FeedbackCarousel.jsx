import React from "react";
import Carousel from "react-bootstrap/Carousel";
import FeedbackCard from "./FeedbackCard";

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const FeedbackCarousel = ({ feedbacks }) => {
  const slides = chunkArray(feedbacks, 3);

  return (
    <div className="feedback-carousel-section">
      <h3>Feedback</h3>
      <Carousel
        indicators={false}
        nextLabel=""
        prevLabel=""
        className="feedback-carousel"
      >
        {slides.map((slide, idx) => (
          <Carousel.Item key={idx}>
            <div className="d-flex justify-content-center gap-4">
              {slide.map((fb) => (
                <FeedbackCard key={fb.feedback_id} feedback={fb} />
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default FeedbackCarousel;
