import React from "react";

const ContactSection = ({ email }) => {
  return (
    <section className="py-12 bg-white"> {/* Added padding and background */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between"> {/* Used flexbox for layout and responsiveness */}
        <div className="flex flex-col md:w-1/2"> {/* Left section */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4"> {/* Title with gradient text */}
            Contact Us
          </h2>
          <p className="text-lg text-gray-700"> {/* Subtitle */}
            Contact Us for any queries,Anytime,Anywhere,Always
          </p>
        </div>
        <div className="mt-8 md:mt-0"> {/* Button container */}
          <a
            href={`mailto: ${email}`}
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300" // Button styling with gradient
          >
            CONTACT US
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
