// src/components/Navbar/Navbar.jsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import AnimatedBanner from "../AnimatedBanner";
import { usePathname } from "next/navigation";

const societies = [
  { code: "hdw", name: "Hardware Club" },
{ code: "ftc", name: "Future Tech Club" },
{ code: "cod", name: "Coders Club" },
{ code: "wic", name: "Women Innovation Club" },
{ code: "crc", name: "Creative Club" },
{ code: "med", name: "Media Club" },
{ code: "pod", name: "Podcast Club" },
{ code: "ipr", name: "IPR Club" },
];

const NavLink = ({ href, children, onClick, target }) => (
  <motion.a
    href={href}
    className="text-white hover:text-orange-200 text-lg transition-colors duration-300"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    target={target}
  >
    {children}
  </motion.a>
);

const Navbar = () => {
  const [isSocietiesHovered, setIsSocietiesHovered] = useState(false); // State for Clubs dropdown hover
  const [isExecomHovered, setIsExecomHovered] = useState(false); // State for Execom dropdown hover
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSocietiesOpen, setIsMobileSocietiesOpen] = useState(false); // State for mobile Clubs dropdown
  const [isMobileExecomOpen, setIsMobileExecomOpen] = useState(false); // State for mobile Execom dropdown

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileSocietiesOpen(false); // Close mobile Clubs dropdown on mobile menu toggle
    setIsMobileExecomOpen(false); // Close mobile Execom dropdown on mobile menu toggle
  };

  const toggleMobileSocieties = () => {
    setIsMobileSocietiesOpen(!isMobileSocietiesOpen);
    setIsMobileExecomOpen(false); // Close mobile Execom dropdown when opening mobile Societies
  };

  const toggleMobileExecom = () => {
    setIsMobileExecomOpen(!isMobileExecomOpen);
    setIsMobileSocietiesOpen(false); // Close mobile Societies dropdown when opening mobile Execom
  };

  const pathname = usePathname();

  return (
    <motion.nav
      ref={ref}
      className="bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 w-full relative z-50 shadow-lg"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : -50 }}
      transition={{ duration: 0.5 }}
    >
      {/* AnimatedBanner: A component for displaying any special alerts above the navigation bar. Edit and import to include it in code for alertting */}
      {/* <AnimatedBanner/> */}
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href={"/"}>
          <div className="flex items-center p-2 bg-white/80 rounded"> {/* Added padding and background */}
            <Image
              src="/images/IEDC Sahrdaya.png"
              alt="IEDC Logo"
              className="h-12"
              width={0}
              height={0}
              sizes="10rem"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex flex-grow justify-center space-x-8 relative">
          <NavLink href="/#about">About Us</NavLink>
          <NavLink href="/#events">Events</NavLink>
          {/* Clubs Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsSocietiesHovered(true)}
            onMouseLeave={() => setIsSocietiesHovered(false)}
          >
            <motion.button
              className="text-white hover:text-orange-200 text-lg focus:outline-none flex items-center transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Clubs
              <motion.div
                animate={{ rotate: isSocietiesHovered ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="ml-1" size={20} />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {isSocietiesHovered && (
                <motion.div
                  className="absolute top-full left-0 w-64 bg-white shadow-lg mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="grid grid-cols-1 gap-2 p-4 max-h-80 overflow-y-auto scrollbar-hide"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {societies.map((society, index) => (
                      <motion.a
                        key={index}
                        href={`/societies/${society.code}`}
                        className="text-gray-800 hover:text-orange-600 block p-2 hover:bg-orange-50 transition-colors duration-300"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, originX: 0 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {society.name}
                      </motion.a>
                    ))}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Execom Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsExecomHovered(true)}
            onMouseLeave={() => setIsExecomHovered(false)}
          >
            <motion.button
              className="text-white hover:text-orange-200 text-lg focus:outline-none flex items-center transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Execom
              <motion.div
                animate={{ rotate: isExecomHovered ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="ml-1" size={20} />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {isExecomHovered && (
                <motion.div
                  className="absolute top-full left-0 w-48 bg-white shadow-lg mt-2" // Adjusted width for fewer links
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="grid grid-cols-1 gap-2 p-4" // Removed max-h and scrollbar for fewer links
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.a
                      href="/execom"
                      className="text-gray-800 hover:text-orange-600 block p-2 hover:bg-orange-50 transition-colors duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, originX: 0 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Current Execom
                    </motion.a>
                    <motion.a
                      href="/past-execom"
                      className="text-gray-800 hover:text-orange-600 block p-2 hover:bg-orange-50 transition-colors duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, originX: 0 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Past Execom
                    </motion.a>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="mailto:iedcbootcamp@sahrdaya.ac.in">Contact Us</NavLink>
        </div>

        {/* Right: Join Button (Desktop) and Hamburger Menu (Mobile) */}
        <div className="flex gap-4 items-center">
          <motion.a
            href="/signin"
            className="hidden md:inline-block px-6 py-3 bg-white text-orange-600 rounded-full font-semibold hover:bg-orange-100 transition-all duration-300 text-lg shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign In/Up
          </motion.a>
          <button
            className="md:hidden text-white focus:outline-none hover:text-orange-200 transition-colors duration-300"
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
            className="md:hidden bg-gradient-to-b from-orange-500 to-yellow-500 shadow-lg text-white"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col p-4 space-y-4">
              <NavLink href="/#about" onClick={toggleMobileMenu}>
                About Us
              </NavLink>
              <NavLink href="/#events" onClick={toggleMobileMenu}>
                Events
              </NavLink>
              {/* Mobile Clubs Dropdown */}
              <motion.button
                className="text-white hover:text-orange-200 text-lg focus:outline-none flex items-center justify-between transition-colors duration-300"
                onClick={toggleMobileSocieties}
              >
                Clubs
                <motion.div
                  animate={{ rotate: isMobileSocietiesOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {isMobileSocietiesOpen && (
                  <motion.div
                    className="pl-4 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {societies.map((society, index) => (
                      <motion.a
                        key={index}
                        href={`/societies/${society.code}`}
                        className="text-orange-100 hover:text-white block transition-colors duration-300"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, originX: 0 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleMobileMenu}
                      >
                        {society.name}
                      </motion.a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Mobile Execom Dropdown */}
              <motion.button
                className="text-white hover:text-orange-200 text-lg focus:outline-none flex items-center justify-between transition-colors duration-300"
                onClick={toggleMobileExecom}
              >
                Execom
                <motion.div
                  animate={{ rotate: isMobileExecomOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {isMobileExecomOpen && (
                  <motion.div
                    className="pl-4 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.a
                      href="/execom"
                      className="text-orange-100 hover:text-white block transition-colors duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, originX: 0 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMobileMenu}
                    >
                      Current Execom
                    </motion.a>
                    <motion.a
                      href="/past-execom"
                      className="text-orange-100 hover:text-white block transition-colors duration-300"
                      variants={itemVariants}
                      whileHover={{ scale: 1.05, originX: 0 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMobileMenu}
                    >
                      Past Execom
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>

              <NavLink href="/gallery" onClick={toggleMobileMenu}>
                Gallery
              </NavLink>
              <NavLink href="mailto:iedcbootcamp@sahrdaya.ac.in" onClick={toggleMobileMenu}>
                Contact Us
              </NavLink>
              <motion.a
                href="/signin"
                className="px-6 py-3 bg-white text-orange-600 rounded-full hover:bg-orange-100 text-lg text-center font-semibold transition-all duration-300 shadow-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMobileMenu}
              >
                Sign In
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for hiding scrollbar */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;
