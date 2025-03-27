import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 text-center">
      <p>&copy; {new Date().getFullYear()} EventEase. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
