"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";

function Societies() {
  const societies = [
    "hdw",
"ftc",
"cod",
"wic",
"crc",
"med",
"pod",
"ipr",
    // Add more societies here if needed
  ];
  const societyLogos = societies.map((society, index) => ({
    id: index + 1,
    name: society,
    logo: `/images/Societies/${society}.png`,
  }));

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 bg-gradient-to-br from-white via-orange-50 to-yellow-50 relative overflow-hidden">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          className="text-center mb-12" // Adjusted margin-bottom
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4" // Adjusted text size and margin-bottom
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our Clubs
          </motion.h2>
          <motion.div
            className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full" // Adjusted width and height
            initial={{ width: 0 }}
            animate={inView ? { width: 96 } : {}} // Adjusted animate width
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={inView ? { opacity: 1, y: 0 } : {}}
           transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30} // Increased spaceBetween
            slidesPerView="auto"
            loop={true}
            speed={5000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 15, // Adjusted spaceBetween
              },
              480: {
                slidesPerView: 3,
                spaceBetween: 20, // Adjusted spaceBetween
              },
              640: {
                slidesPerView: 4,
                spaceBetween: 25, // Adjusted spaceBetween
              },
              768: {
                slidesPerView: 5,
                spaceBetween: 30, // Adjusted spaceBetween
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 40, // Adjusted spaceBetween
              },
            }}
            className="mySwiper"
          >
            {societyLogos.map((society) => (
              <SwiperSlide key={society.id} style={{ width: "auto" }}>
                <motion.div
                  className="p-4 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-orange-100" // Added styling
                  whileHover={{ scale: 1.1, y: -5 }} // Added hover animation
                  transition={{ duration: 0.3 }}
                >
                  <img src={society.logo} alt={society.name} className="h-16 w-auto object-contain" /> {/* Adjusted image size */}
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}

export default Societies;
