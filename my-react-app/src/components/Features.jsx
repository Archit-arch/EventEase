import React from "react";

const Features = () => {
  const featureList = [
    { title: "Easy Booking", description: "Book your favorite events with a few clicks." },
    { title: "24/7 Support", description: "We are here to help anytime." },
  ];

  return (
    <section className="p-12">
      <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
      <div className="flex flex-col md:flex-row justify-around">
        {featureList.map((feature, index) => (
          <div key={index} className="flex-1 text-center p-4">
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
