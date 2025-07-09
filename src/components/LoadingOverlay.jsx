"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styled, { keyframes } from "styled-components";
import SBFavicon from "../../public/images/favicon.png";

// Define the spinning animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Container for the spinner
const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom right, #fff7ed, #fffaf0);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

// Define the thin spinner style
const Spinner = styled.div`
  width: 80px; // Size of the spinner
  height: 80px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top: 3px solid #f97316; // Thin colored border
  border-right: 3px solid #facc15; // Thin colored border
  background: white;
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
  animation: ${spin} 2s linear infinite; // Spinning effect
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: -8px;
    left: -8px;
    width: 96px; // Bigger circle behind
    height: 96px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 237, 213, 0.5), transparent);
    z-index: -1;
    animation: ${spin} 4s linear infinite reverse;
  }
`;

const LoadingOverlay = ({ children }) => {
  return (
    <SpinnerWrapper>
      <Spinner>
        <Image
          alt="Loading"
          src={SBFavicon}
          width={50}
          height={50}
          priority
        />
      </Spinner>
      {children} {/* Optional: for displaying text below spinner */}
    </SpinnerWrapper>
  );
};

export default LoadingOverlay;
