import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // Import motion

function FooterSection() {
  return (
    <motion.div
      className="bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-700 text-white py-12 mt-8 relative overflow-hidden" // Applied gradient background and increased padding/margin
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, threshold: 0.2 }}
    >
       {/* Optional: Add some subtle background shapes/particles similar to other sections */}
       {/* For example: */}
       <motion.div
        className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full mix-blend-screen"
        animate={{ y: [0, 20, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
       />
        <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full mix-blend-screen"
        animate={{ y: [0, -20, 0], rotate: [0, -45, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
       />


      <div className="container mx-auto px-4 flex flex-wrap justify-around relative z-10"> {/* Added px-4 and z-10 */}
        <div className="flex flex-col items-center mb-8 lg:mb-0"> {/* Adjusted margin-bottom */}
          <motion.div
            className="logo mb-6" // Increased margin-bottom
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             viewport={{ once: true }}
          >
            <Image
              src="/images/Footer/Footer - Sahrdaya Logo.png"
              alt="Sahrdaya Logo"
              height={100} // Adjusted height
              width={100} // Adjusted width
              className="h-24 w-auto" // Adjusted height
              unoptimized
            />
          </motion.div>
          <motion.div
            className="logo p-2 bg-white/80 rounded h-24 w-auto overflow-hidden flex items-center justify-center mb-6" // Added padding and background, fixed size, overflow-hidden, centering, and margin-bottom
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, delay: 0.3 }}
             viewport={{ once: true }}
          >
            <Image
              src="/images/Footer/IEDC.png"
              alt="IEDC Logo"
              height={550} // Adjusted height
              width={350} // Adjusted width
              className="h-27 w-41" // Set image to fill the container height
              unoptimized
            />
          </motion.div>
           {/* KSUM Logo */}
          <motion.div
            className="logo p-2 bg-white/80 rounded h-24 w-auto overflow-hidden flex items-center justify-center" // Added padding and background, fixed size, overflow-hidden, and centering
             initial={{ opacity: 0, scale: 0.8 }}
             whileInView={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.6, delay: 0.4 }}
             viewport={{ once: true }}
          >
            <Image
              src="/images/Footer/KSUM.png"
              alt="KSUM Logo"
              height={550} // Adjusted height
              width={350} // Adjusted width
              className="h-20 w-auto" // Set image to fill the container height
              unoptimized
            />
          </motion.div>
        </div>
        <div className="flex flex-col items-center mb-8 lg:mb-0"> {/* Adjusted margin-bottom */}
          <h3 className="font-bold text-xl mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">Important Links</h3> {/* Applied gradient text */}
          <div className="space-y-3 text-orange-100"> {/* Increased space-y and adjusted text color */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}>
              <Link href={"https://iedc.startupmission.in/"}>
                <p className="hover:underline">&gt; IEDC Kerala</p>
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }}>
              <Link href={"https://startupmission.kerala.gov.in/"}>
                <p className="hover:underline">&gt; Kerala StartUp Mission</p>
              </Link>
            </motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }} viewport={{ once: true }}>
              <Link href={"https://iedc.startupmission.in/nest/"}>
                <p className="hover:underline">&gt; IEDC NEST</p>
              </Link>
             </motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }} viewport={{ once: true }}>
              <Link href={"https://sahrdayatbiihub.com/"}>
                <p className="hover:underline">&gt; Sahrdaya TBII HUB</p>
              </Link>
             </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7 }} viewport={{ once: true }}>
              <Link href={"https://sahrdaya.ac.in"}>
                <p className="hover:underline">
                  &gt; Sahrdaya College of Engineering and Technology (Autonomous)
                </p>
              </Link>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col items-center lg:items-start"> {/* Adjusted alignment for larger screens */}
          <h3 className="font-bold text-xl mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-200">Contact Us</h3> {/* Applied gradient text */}
          <div className="flex flex-col gap-3 mb-6 text-orange-100"> {/* Increased gap and adjusted text color */}
             <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }}>Jibin Jose - jibinjose@sahrdaya.ac.in</motion.p>
             <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }}>Sebin Davis K - sebindavis@sahrdaya.ac.in</motion.p>
             <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }} viewport={{ once: true }}>Jasmy Davis - jasmidavis@sahrdaya.ac.in</motion.p>
             <motion.p initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.6 }} viewport={{ once: true }}>Malavika Chandran - malavika323716@sahrdaya.ac.in</motion.p>
          </div>
          <div className="flex space-x-5"> {/* Increased space-x */}
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <Link href={"https://www.facebook.com/iedcsahrdaya"}>
                <Image
                  src="/images/Footer/fb-logo.png"
                  alt="Facebook"
                  className="h-9 w-9" // Adjusted size
                  height={10}
                  width={10}
                  unoptimized
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <Link href={"https://www.instagram.com/iedc_sahrdaya/\""}>
                <Image
                  src="/images/Footer/instagram-logo.png"
                  alt="Instagram"
                   className="h-9 w-9" // Adjusted size
                  height={10}
                  width={10}
                  unoptimized
                />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <Link href={"https://www.linkedin.com/in/iedc-sahrdaya-788970175/\""}>
                <Image
                  src="/images/Footer/linkedin-logo.png"
                  alt="LinkedIn"
                   className="h-9 w-9" // Adjusted size
                  height={10}
                  width={10}
                  unoptimized
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
       <div className="text-center text-sm text-orange-200 mt-8 relative z-10"> {/* Added margin-top and z-10 */}
         <p>&copy; {new Date().getFullYear()} IEDC Sahrdaya. All rights reserved.</p>
       </div>
    </motion.div>
  );
}

export default FooterSection;
