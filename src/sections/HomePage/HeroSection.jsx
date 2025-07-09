"use client"

import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"
import { Pagination, Autoplay } from "swiper/modules"
import { ArrowRight, Sparkles, Rocket, Users, Lightbulb } from "lucide-react"
import { useRouter } from "next/navigation"

const images = [
  "/images/Slider/1.jpg",
  "/images/Slider/2.jpg",
  "/images/Slider/3.jpg",
  "/images/Slider/4.jpg",
]

const FloatingElement = ({ children, delay = 0, className = "" }) => (
  <motion.div
    className={`absolute ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{
      opacity: [0.3, 0.8, 0.3],
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
)

function HeroSection() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-100 via-yellow-100 to-white">
      {/* Floating Background Elements */}
      <FloatingElement delay={0} className="top-10 left-5 sm:top-20 sm:left-10 text-orange-300">
        <Sparkles size={30} smsize={40} /> {/* Adjusted size for smaller screens */}
      </FloatingElement>
      <FloatingElement delay={1} className="top-20 right-5 sm:top-40 sm:right-20 text-yellow-400">
        <Rocket size={25} smsize={35} /> {/* Adjusted size for smaller screens */}
      </FloatingElement>
      <FloatingElement delay={2} className="bottom-20 left-5 sm:bottom-40 sm:left-20 text-orange-400 hidden xs:block">
        {/* Hidden on extra small screens */}
        <Users size={35} smsize={45} /> {/* Adjusted size for smaller screens */}
      </FloatingElement>
      <FloatingElement delay={3} className="bottom-10 right-5 sm:bottom-20 sm:right-32 text-yellow-300 hidden xs:block">
        {/* Hidden on extra small screens */}
        <Lightbulb size={28} smsize={38} /> {/* Adjusted size for smaller screens */}
      </FloatingElement>

      {/* Animated Background Shapes */}
      <motion.div
        className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <div className="container mx-auto px-4 pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          className="text-center lg:text-left space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
 {/* Added responsive top padding */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="pt-10 sm:pt-0" // Increased top padding
          >
            <span className="inline-block px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
              Innovation • Entrepreneurship • Development
    </span>
          </motion.div>

          <motion.h1
            className="text-6xl lg:text-8xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            IEDC
            <motion.span
              className="block text-4xl lg:text-6xl mt-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Sahrdaya
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl lg:text-2xl text-gray-700 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Empowering the next generation of innovators and entrepreneurs through cutting-edge programs, mentorship,
            and collaborative learning experiences.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <motion.button
              className="group px-10 py-5 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const upcomingEventsSection = document.getElementById('upcoming-events');
                if (upcomingEventsSection) {
                  upcomingEventsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}          
            >
              Explore Events
              <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" size={22} />
            </motion.button>

            <motion.button
              className="px-10 py-5 border-3 border-orange-500 text-orange-600 rounded-full font-semibold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/signin')}
            >
              Join Community
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Content - Enhanced Image Carousel */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Swiper
              pagination={{
                clickable: true,
                bulletActiveClass: "swiper-pagination-bullet-active !bg-orange-500",
                bulletClass: "swiper-pagination-bullet !bg-orange-300",
              }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              modules={[Pagination, Autoplay]}
              className="w-full h-80 sm:h-96 lg:h-[500px] rounded-3xl"
              loop={true}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index} className="relative">
                  <motion.img
                    src={src}
                    alt={`IEDC Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-900/30 to-transparent" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Enhanced Decorative Elements */}
          <motion.div
            className="absolute -top-4 -right-4 w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80 shadow-lg hidden xs:block"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-4 -left-4 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full opacity-60 shadow-lg hidden xs:block"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Floating Stats */}
          <motion.div
            className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-orange-100"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-600">500+</div>
              <div className="text-xs sm:text-sm text-gray-600">Innovators</div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-white rounded-2xl p-3 sm:p-4 shadow-xl border border-yellow-100"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
          >
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">50+</div>
              <div className="text-xs sm:text-sm text-gray-600">Startups</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default HeroSection
