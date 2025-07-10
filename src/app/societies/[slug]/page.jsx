"use client";

import Loading from "@/app/loading";
import AboutSection from "@/sections/SocitiesPage/AboutSection";
import ExecomSection from "@/sections/SocitiesPage/ExecomSection";
import FooterSection from "@/sections/HomePage/FooterSection";
import LatestEventSection from "@/sections/HomePage/LatestEventSection";
import ContactSection from "@/sections/SocitiesPage/ContactSection";
import HeroSection from "@/sections/SocitiesPage/HeroSection";
import SocietiesNavbar from "@/sections/SocitiesPage/Navbar/SocietiesNavbar";
import {
  fetchEventsBySociety,
  fetchPeopleBySociety,
  fetchSocietyDataById,
} from "@/utils/FirebaseFunctions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function SocietyPage({ params }) {
  const router = useRouter();
  const [societyData, setSocietyData] = useState(null);
  const [latestEvents, setLatestEvents] = useState([]);
  const [execom, setExecom] = useState([]);
  const { slug } = params;

  useEffect(() => {
    const loadSocietyData = async () => {
      try {
        console.log('Fetching data for slug:', slug); // Log slug at the beginning
        const data = await fetchSocietyDataById(slug);
        console.log('Data fetched by fetchSocietyDataById:', data); // Log the result
        if (!data || !data.society || data.society === "" || data.society === "Main") {
          router.push("/404"); // Redirect to 404 page if society not found
          return;
        }
        setSocietyData(data);
        console.log('Society data set:', data); // Log societyData after setting state
        fetchEventsBySociety(data.society, setLatestEvents);
        // Pass the society name to fetchPeopleBySociety to get the execom for this society
        fetchPeopleBySociety(data.society, setExecom); 
      } catch (error) {
        console.error("Error loading society data:", error);
        router.push("/404");
      }
    };

    loadSocietyData();
  }, [slug, router]);
  console.log(societyData);

  if (!societyData) {
    return <Loading />;
  }

  const logo = {
    src: `/images/Societies/${slug}.png`, // You might want to add this to your societyData
    alt: `${societyData.society} Logo`,
    width: 100,
    height: 20,
  };

  const navLinks = [
    { href: "#about", text: "About Us" },
    { href: "#execom", text: "Team" },
    { href: "#events", text: "Events" },
  ];

  const buttonLink = {
    href: "/signin",
    text: "Join IEDC Sahrdaya",
  };

  return (
    <div>
 <title>{`${societyData.society} | IEDC Sahrdaya`}</title><SocietiesNavbar logo={logo}
        navLinks={navLinks}
        buttonLink={buttonLink}
      />
      <HeroSection
        path={societyData.heroImage}
        title={`IEDC ${societyData.society.toUpperCase()} `}
        subtitle={`WELCOME TO THE HOME PAGE OF ${societyData.society.toUpperCase()}  SAHRDAYA`}
      />
      <AboutSection
        title={`About ${societyData.society}`}
        textContent={societyData.aboutText}
        imageSrc={societyData.backgroundImage}
      />
      <LatestEventSection title="Latest Events" events={latestEvents} />
      <ExecomSection people={execom} />
      <ContactSection email={societyData.email} />
      <FooterSection />
    </div>
  );
}
export default SocietyPage;
