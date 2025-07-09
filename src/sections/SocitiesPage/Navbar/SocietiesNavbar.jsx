"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import { Menu, X } from "lucide-react"; // Import icons

const SocietiesNavbar = ({ logo, navLinks }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.nav
      className="bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 w-full relative z-50 shadow-lg" // Apply gradient background and shadow
      initial={{ opacity: 0, y: -50 }} // Add initial animation state
      animate={{ opacity: 1, y: 0 }} // Add animation state
      transition={{ duration: 0.5 }} // Add animation transition
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <div className="flex items-center p-2 bg-white/80 rounded"> {/* Added padding and background to logo */}
          <Image
            src={logo.src}
            alt={logo.alt}
            width={0} // Set width and height to 0 for fluid sizing
            height={0}
            sizes="10rem" // Specify sizes
            style={{ width: "auto", height: "auto", maxHeight: "3rem" }} // Apply max height and auto width/height
          />
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex flex-grow justify-center space-x-8 relative">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-white hover:text-orange-200 text-lg transition-colors duration-300" // Link styling
            >
              {link.text}
            </a>
          ))}
        </div>

        {/* Right: Return Home Button (Desktop) and Hamburger Menu (Mobile) */}
        <div className="flex gap-4 items-center">
          <button
            onClick={() => router.push('/')}
            className="hidden md:inline-block px-6 py-3 bg-white text-orange-600 rounded-full font-semibold hover:bg-orange-100 transition-all duration-300 text-lg shadow-md" // Button styling
          >
            Return Home
          </button>
          <button
            className="md:hidden text-white focus:outline-none hover:text-orange-200 transition-colors duration-300" // Hamburger menu styling
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-gradient-to-b from-orange-500 to-yellow-500 shadow-lg text-white" // Mobile menu styling with gradient
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-4 space-y-4">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-white hover:text-orange-200 text-lg transition-colors duration-300" // Mobile link styling
                  onClick={toggleMobileMenu}
                >
                  {link.text}
                </a>
              ))}
              <button
                onClick={() => {
                  toggleMobileMenu();
                  router.push('/')}}
                className="px-6 py-3 bg-white text-orange-600 rounded-full hover:bg-orange-100 text-lg text-center font-semibold transition-all duration-300 shadow-md" // Mobile button styling
              >
                Return Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
export default SocietiesNavbar;
