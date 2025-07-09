"use client";
import Image from "next/image";
import React from "react";
import styled, { keyframes } from "styled-components";
import SBFavicon from "../../public/images/favicon.png";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom right, #fff7ed, #fffaf0);
`;

const Spinner = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 6px solid transparent;
  border-top: 6px solid #f97316;
  border-right: 6px solid #facc15;
  background: white;
  box-shadow: 0 4px 20px rgba(249, 115, 22, 0.3);
  animation: ${spin} 1.2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: -8px;
    left: -8px;
    width: 116px;
    height: 116px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 237, 213, 0.5), transparent);
    z-index: -1;
    animation: ${spin} 2s linear infinite reverse;
  }
`;

export default function Loading() {
  return (
    <SpinnerWrapper>
      <Spinner>
        <Image
          alt="IEDC Logo"
          priority
          src={SBFavicon}
          height={50}
          width={50}
        />
      </Spinner>
    </SpinnerWrapper>
  );
}
