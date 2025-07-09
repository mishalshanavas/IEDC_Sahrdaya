"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Target, Lightbulb, Users, Award, Rocket } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Mission Driven",
    description: "Fostering innovation and entrepreneurship in the next generation",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Lightbulb,
    title: "Innovation Hub",
    description: "Creating solutions for real-world problems through technology",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a network of passionate innovators and entrepreneurs",
    color: "from-orange-500 to-yellow-500",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering high-quality programs and mentorship",
    color: "from-red-500 to-orange-500",
  },
]

function AboutSection({ title, textContent, imageSrc }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  return (
    <section className="py-24 bg-gradient-to-br from-white via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Enhanced Background Decorations */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-200 to-transparent rounded-full opacity-30"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-200 to-transparent rounded-full opacity-25"
        animate={{ scale: [1.1, 1, 1.1], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY }}
      />

      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-6xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.div
            className="w-32 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={inView ? { width: 128 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-xl text-gray-700 leading-relaxed">{textContent}</p>

      
           
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={title}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent" />
            </div>

            {/* Enhanced Floating Stats */}
            <motion.div
              className="absolute -top-8 -right-8 bg-white rounded-3xl p-6 shadow-xl border border-orange-100"
              animate={{ y: [-15, 15, -15], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">1000+</div>
                <div className="text-sm text-gray-600 font-semibold">Students Influenced</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -left-8 bg-white rounded-3xl p-6 shadow-xl border border-yellow-100"
              animate={{ y: [15, -15, 15], rotate: [0, -2, 2, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600">50+</div>
                <div className="text-sm text-gray-600 font-semibold">Active Members</div>
              </div>
            </motion.div>

            <motion.div
              className="absolute top-1/2 -left-6 bg-white rounded-3xl p-4 shadow-xl border border-orange-100"
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">25+</div>
                <div className="text-xs text-gray-600 font-semibold">Events Conducted</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 group"
              whileHover={{ y: -10, scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            >
              <motion.div
                className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className="text-white" size={32} />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
