import React from "react";
import Image from "next/image";

function HeroSection({ path, title, subtitle }) {
  return (
    <section className="relative w-full h-[60vh] overflow-hidden flex flex-col justify-center items-center text-center">
      {/* Background Image with Blur */}
      <div className="absolute inset-0">
        <Image
          src={path}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          priority
          className="filter blur-sm transform scale-110"
        />
        {/* Optional: Add an overlay to make text more readable */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Text Overlay */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-100 text-shadow-lg stroke-black stroke-1 text-shadow-glow"> {/* Added text-shadow-glow */}
          {title}
        </h1>
        <p className="text-lg md:text-xl max-w-4xl mx-auto text-gray-100 text-shadow-md stroke-black stroke-0.5 text-shadow-glow"> {/* Added text-shadow-glow */}
          {subtitle}
        </p>
      </div>
    </section>
  );
}

export default HeroSection;
