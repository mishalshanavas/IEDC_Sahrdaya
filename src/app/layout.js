import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="title" content="IEDC Sahrday" />
        <title>IEDC Sahrdaya</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>
        <meta
          name="description"
          content="Official website of the Innovation and Entrepreneurship Development Cell (IEDC) at Sahrdaya College of Engineering and Technology, Kodakara."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iedcsahrdaya.co.in/" />
        <meta property="og:title" content="IEDC Sahrdaya" />
        <meta
          property="og:description"
          content="Official website of IEDC Sahrdaya College of Engineering and Technology, Kodakara."
        />
        <meta
          property="og:image"
          content="https://i.ibb.co/4n8S0wsM/image.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://metatags.io/" />
        <meta property="twitter:title" content="IEDC Sahrdaya" />
        <meta
          property="twitter:description"
          content="Official website of IEDC at Sahrdaya College of Engineering and Technology, Kodakara. IEDC is a government-funded initiative to promote innovation and entrepreneurship among students."
        />
        <meta
          property="twitter:image"
          content="https://i.ibb.co/4n8S0wsM/image.png"
        />
        <meta
          name="keywords"
          content="IEDC Sahrdaya, Innovation and Entrepreneurship Development Cell, student organization, entrepreneurship, innovation, technical skills, workshops, seminars, events, Sahrdaya College of Engineering and Technology, scet, startups, incubation, skill development"
        />
        <link rel="apple-touch-icon" href="/public/apple-touch-icon.png"></link>

        <meta name="theme-color" content="#2563eb" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
