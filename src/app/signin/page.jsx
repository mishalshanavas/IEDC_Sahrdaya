"use client";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import styled from "styled-components";
import Navbar from "../../components/Navbar/Navbar";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { handleLogin } from "../../utils/FirebaseFunctions";
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #0077be;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  width: 100%;
  max-width: 800px;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: #0077be;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005fa3;
  }
`;

const GoogleSignInButton = styled(Button)`
  background-color: #db4437;
  margin-top: 1rem;

  &:hover {
    background-color: #c33126;
  }
`;

export default function SignIn() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Use a ref to track if a redirect is pending from a Google sign-up
  const isRedirectingAfterGoogleSignup = React.useRef(false);

  useEffect(() => {
    document.title = "Sign in/Up | IEDC Sahrdaya";
    console.log("useEffect: auth.onAuthStateChanged listener started");

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("useEffect: auth state changed, user:", user);
      
      // Only proceed if user is authenticated and not redirecting after Google sign-up
      if (user && !isRedirectingAfterGoogleSignup.current) { 
        try {
          // Wait for user data to be available before deciding redirection
          const userDocRef = doc(db, "users", user.uid);
          console.log("useEffect: Fetching user document for user:", user.uid);
          const docSnap = await getDoc(userDocRef);
          console.log("useEffect: User document snapshot:", docSnap.exists() ? docSnap.data() : "does not exist");
          
          // Redirect non-student users to the dashboard if they are on the signin page and the user document exists
          if (
            docSnap.exists() &&
            docSnap.data()?.society !== "student" &&
            window.location.pathname === "/signin" 
          ) {
            router.push("/dashboard");
          }
          // No redirection needed for student users who are already on the signin page
          setLoading(false);
        } catch (error) {
          // Handle errors during user document fetching or redirection
          toast.error(error.message);
          setLoading(false);
        }
      } else {
 setLoading(false); // Set loading to false if user is null
 }
 });


    return () => unsubscribe();
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit: Login button clicked");
    setLoading(true);
    console.log("handleSubmit: Calling handleLogin");

    handleLogin({ email: Email, password: Password })
      .then(async (userCredential) => {
        console.log("handleSubmit: handleLogin successful, userCredential:", userCredential);
        // Check if userCredential and userCredential.user are not null or undefined
        if (userCredential && userCredential.user) {
          const user = userCredential.user;

          // Wait for user data to be available before deciding redirection
          const userDoc = await getDoc(doc(db, "users", user.uid));
          console.log("handleSubmit: User document snapshot after login:", userDoc.exists() ? userDoc.data() : "does not exist");

          // Redirect student users to the student dashboard
          if (userDoc.exists() && userDoc.data()?.society === "student") {
            console.log("handleSubmit: User is a student, redirecting to /studentdashboard");
            router.push("/studentdashboard");
          } else {
            console.log("handleSubmit: User is not a student, redirecting to /dashboard");
            router.push("/dashboard");
          }
        } else {
          console.error("handleSubmit: userCredential or userCredential.user is undefined or null");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleSignUp = useCallback(async () => {
    console.log("handleGoogleSignUp: Google sign up button clicked");
    try {
      const { handleGoogleSignUp: importedHandleGoogleSignUp } = await import("../../utils/FirebaseFunctions");
      isRedirectingAfterGoogleSignup.current = true;
      console.log("handleGoogleSignUp: Calling imported handleGoogleSignUp");

      await importedHandleGoogleSignUp(router);
      console.log("handleGoogleSignUp: imported handleGoogleSignUp finished");
    } catch (error) {
      toast.error(error.message);
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Sign In/Up - IEDC SAHRDAYA</title>
        <meta name="description" content="Sign In/Up to IEDC SAHRDAYA" />
      </Head>
      <Navbar />
      <Container>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <ToastContainer />

            <Title>Sign in</Title>
            <Subtitle>
              This Feature is for Execom members only.<br />
              Existing users can enter their credentials and login.<br />
              New users can sign up with Google and will receive a mail to set up their credentials.
            </Subtitle>
            <Form onSubmit={handleSubmit}>
              <Input
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-Mail"
                required
              />
              <Input
                type="password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <Button type="submit">SIGN IN</Button>
              <GoogleSignInButton onClick={handleGoogleSignUp}>
                Sign In/Up with Google
              </GoogleSignInButton>
            </Form>
          </>
        )}
      </Container>
    </>
  );
}
