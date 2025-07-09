"use client"

import React, { useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, Briefcase, Award, Rocket, Code, Lightbulb } from "lucide-react"

const CountUp = ({ target, duration = 2 }) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })

  React.useEffect(() => {
    if (inView) {
      let startTime = null
      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
        setCount(Math.floor(progress * target))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [inView, target, duration])

  return (
    <motion.span
      ref={ref}
      className="text-4xl lg:text-6xl font-bold"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {count}+
    </motion.span>
  )
}

const stats = [
  {
    icon: Users, // Changed to Users
    value: 9,
    label: "Clubs",
    color: "from-orange-500 to-red-500",
    bgColor: "from-orange-100 to-red-100",
  },
  {
    icon: Code, // Changed to Code
    value: 150,
    label: "Workshops Conducted",
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-100 to-orange-100",
  },
  {
    icon: Lightbulb, // Changed to Lightbulb
    value: 3000,
    label: "Students Influenced",
    color: "from-orange-500 to-yellow-500",
    bgColor: "from-orange-100 to-yellow-100",
  },
  {
    icon: Rocket, // Changed to Rocket
    value: 15,
    label: "StartUps Funded",
    color: "from-red-500 to-orange-500",
    bgColor: "from-red-100 to-orange-100",
  },
  {
    icon: Award, // Changed to Award
    value: 1091000,
    label: "Funded Amount",
    color: "from-orange-600 to-yellow-600",
    bgColor: "from-orange-100 to-yellow-100",
  },
  {
    icon: Briefcase, // Changed to Briefcase
    value: 100,
    label: "Active Volunteers",
    color: "from-yellow-600 to-orange-600",
    bgColor: "from-yellow-100 to-orange-100",
  },
]

function InformantSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section className="py-24 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        style={{
          backgroundImage: "radial-gradient(circle, white 2px, transparent 2px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating Shapes */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full"
        animate={{
          y: [20, -20, 20],
          rotate: [360, 180, 0],
        }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">Our Impact in Numbers</h2>
          <p className="text-xl lg:text-2xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
            Building a community of innovators and entrepreneurs who are changing the world through technology and
            creativity
          </p>
          <motion.div
            className="w-32 h-2 bg-white mx-auto mt-8 rounded-full opacity-80"
            initial={{ width: 0 }}
            animate={inView ? { width: 128 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center relative"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className={`relative mb-8 p-8 bg-gradient-to-br ${stat.bgColor} rounded-3xl shadow-xl backdrop-blur-sm border border-white/20`}
                whileHover={{ scale: 1.05, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="relative mb-6"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-24 h-24 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}
                  >
                    <stat.icon className="text-white" size={36} />
                  </div>

                  {/* Floating particles */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-4 h-4 bg-white rounded-full opacity-80"
                    animate={{
                      y: [-8, 8, -8],
                      opacity: [0.8, 0.4, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.2,
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-300 rounded-full opacity-70"
                    animate={{
                      y: [8, -8, 8],
                      opacity: [0.7, 0.3, 0.7],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.3,
                    }}
                  />
                </motion.div>

                <div className="text-white">
                  <CountUp target={stat.value} />
                  <motion.p
                    className="text-lg font-semibold text-gray-700 mt-3"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    {stat.label}
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
        </motion.div>
      </div>
    </section>
  )
}

export default InformantSection
