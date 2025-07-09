"use client";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/utils/firebase";
import {
  fetchSocietyData,
  getSociety,
  updateSocietyData,
} from "@/utils/FirebaseFunctions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: #fffaf0;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: linear-gradient(to right, #f97316, #facc15);
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const WelcomeText = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SignOutButton = styled.button`
  background-color: transparent;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;

  &:hover {
    color: #ffe082;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  overflow-y: auto;
`;

const FormSection = styled.div`
  margin-bottom: 20px;
  background-color: #fffaf0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #f97316;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #fcd34d;
  border-radius: 5px;
  height: 150px;
  background-color: #fffaf0;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #fcd34d;
  border-radius: 5px;
  background-color: #fffaf0;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

const SaveButton = styled.button`
  background-color: #f97316;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #fb923c;
    transform: scale(1.02);
  }
`;


const SocietyPage = () => {
  const router = useRouter();
  const [society, setSociety] = useState("");
  const [societyData, setSocietyData] = useState({
    aboutText: "",
    backgroundImage: null,
    heroImage: null,
  });
  useEffect(() => {
    document.title = "Manage Club Page Data | IEDC Sahrdaya"
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return router.push("/signin");
      }
      const userSociety = await getSociety(user.uid);
      setSociety(userSociety);
      if (userSociety.toLowerCase() === "main") {
        router.push("/"); // Redirect to home page or another appropriate page
        return;
      }
      const data = await fetchSocietyData(userSociety);
      setSocietyData(data);
    });
 }, []);
  if (society.toLowerCase() === "main") {
    return null;
  }
  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    setSocietyData((prev) => ({ ...prev, [imageType]: file }));
  };

  const handleSave = async () => {
    try {
      const updatedData = await updateSocietyData(
        society,
        societyData
      );
      setSocietyData((prev) => ({
        ...prev,
        backgroundImage: updatedData.BgImagePath || prev.backgroundImage,
        heroImage: updatedData.HeroImagePath || prev.heroImage,
      }));
      alert("Club data updated successfully!");
    } catch (error) {
      console.error("Error updating club data:", error);
      alert("Failed to update club data. Please try again.");
    }
  };
  return (
    <Container>
      <Sidebar society={society}/>
      <div style={{ flex: 1 }}>
        <Header>
          <WelcomeText>
            Welcome,{society.toUpperCase()} Execom Members of IEDC SAHRDAYA
          </WelcomeText>
          <SignOutButton onClick={() => auth.signOut()}>Sign Out</SignOutButton>
        </Header>
        <Content>
          <FormSection>
            <h2 className="font-bold  text-center text-red-700">
              WARNING: Anything you change here will be reflected at your
              
                club website
              
            </h2>
            <Label>About Text(Please keep your message around 250 words.)</Label>
            <TextArea
              value={societyData.aboutText}
              onChange={(e) =>
                setSocietyData({ ...societyData, aboutText: e.target.value })
              }
            />
          </FormSection>
          <FormSection>
            <Label>This Image appears in the right side of your about text</Label>
            <Input
              type="file"
              onChange={(e) => handleImageChange(e, "backgroundImage")}
            />
            {societyData.backgroundImage && (
              <img
                src={
                  typeof societyData.backgroundImage === "string"
                    ? societyData.backgroundImage
                    : URL.createObjectURL(societyData.backgroundImage)
                }
                alt="Background Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </FormSection>
          <FormSection>
            <Label>This Image will be visible behind the welcome message of your club</Label>
            <Input
              type="file"
              onChange={(e) => handleImageChange(e, "heroImage")}
            />
            {societyData.heroImage && (
              <img
                src={
                  typeof societyData.heroImage === "string"
                    ? societyData.heroImage
                    : URL.createObjectURL(societyData.heroImage)
                }
                alt="Hero Preview"
                style={{ maxWidth: "200px", marginTop: "10px" }}
              />
            )}
          </FormSection>
          <SaveButton onClick={handleSave}>Save Changes</SaveButton>
        </Content>
      </div>
    </Container>
  );
};

export default SocietyPage;
