"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

const StyledH1 = styled.h1`
  margin-top: 2rem;
  font-weight: bold;
  width: 100%;
  text-align: center;
  padding: 0 1rem;
  font-size: 2.5rem;
  background: linear-gradient(to right, #f97316, #facc15);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SectionContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff7ed, #fef3c7);
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const ContentContainer = styled(motion.div)`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  gap: 3rem;
  align-items: center;
  width: 100%;
  max-width: 1200px;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 4rem;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1rem;

  @media (min-width: 768px) {
    align-items: flex-start;
    width: 50%;
    padding: 2rem;
  }
`;

const ImageContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 1.5rem;
    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.4);
  }
`;

const StyledLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem 1.75rem;
  background: linear-gradient(to right, #f97316, #facc15);
  color: white;
  border-radius: 9999px;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(249, 115, 22, 0.4);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(to right, #ea580c, #eab308);
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.6);
    transform: translateY(-2px);
  }
`;

function NotFound() {
  return (
    <SectionContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <StyledH1>404 Page Not Found</StyledH1>
      <ContentContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <TextContainer>
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-center md:text-left mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ color: "#92400e" }}
          >
            Oops! The page you’re looking for doesn’t exist or has been moved.
          </motion.p>
          <motion.p
            className="text-base md:text-lg text-center md:text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ color: "#78350f" }}
          >
            Don’t worry—you can always return to our homepage and explore from there.
          </motion.p>
          <StyledLink href="/">Return to Homepage</StyledLink>
        </TextContainer>
        <ImageContainer
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Image
            src="/images/404.png"
            alt="404 Not Found Illustration"
            width={500}
            height={500}
            priority
          />
        </ImageContainer>
      </ContentContainer>
    </SectionContainer>
  );
}

export default NotFound;
