"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const GalleryNavbar = () => {
  return (
    <motion.nav className="bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 w-full relative z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left: Logo */}
        <Link href="/">
          <div className="flex items-center p-2 bg-white/80 rounded">
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

        {/* Right: Return Home Link */}
        <Link href="/" className="text-white hover:text-orange-200 text-lg transition-colors duration-300">
          Return Home
        </Link>
      </div>
    </motion.nav>
  );
};

export default GalleryNavbar;
