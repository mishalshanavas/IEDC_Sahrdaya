"use client";

import React, { useEffect } from 'react';
import { auth } from '../../utils/firebase';
import styled from 'styled-components';

const SignOutButton = styled.button`
  background-color: #0077be;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  position: absolute;
  top: 20px;
  right: 20px;
  &:hover {
    background-color: #005fa3;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #0077be;
  color: white;
`;

const StudentDashboardWelcome = () => { 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = '/signin';
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <div className="flex justify-center items-center">
        <h1 className="text-2xl font-bold text-center">
          This is a Stricly Limited Feature!
        </h1>
      </div>
      <SignOutButton onClick={() => auth.signOut()}>
        Sign Out
      </SignOutButton>
      <p className="text-center text-red-600 mt-2 font-semibold">
  ⚠️ Note: Sign-in is strictly limited to Execom members. If you are an Execom member and need access, please contact the CTO.
</p>
    </div>
  );
}

export default StudentDashboardWelcome;
