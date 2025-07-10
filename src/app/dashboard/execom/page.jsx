"use client";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/utils/firebase";
import {
  createPerson,
  deletePerson,
  fetchPeopleBySociety,
  getSociety,
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

const CreateButton = styled.button`
  background-color: #f97316;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #fb923c;
    transform: scale(1.02);
  }
`;

const EventsHeader = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #f97316;
  font-weight: 600;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);  /* 4 columns */
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);  /* 3 columns for medium screens */
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);  /* 2 columns for smaller screens */
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;  /* 1 column for very small screens */
  }
`;

const Card = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  text-align: center;
  padding: 20px;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const PersonImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f97316;
`;

const PersonName = styled.h3`
  margin: 10px 0 5px;
  background: linear-gradient(to right, #f97316, #facc15);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  font-size: 1.1rem;
`;

const PersonRole = styled.p`
  color: #666;
  font-size: 0.95rem;
`;

const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f87171;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  width: 90%;
  max-width: 500px;
  z-index: 1001;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #fcd34d;
  border-radius: 5px;
  background-color: #fffaf0;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #fcd34d;
  border-radius: 5px;
  background-color: #fffaf0;

  &:focus {
    outline: none;
    border-color: #f97316;
    box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
  }
`;

const ROLES = [
  "Chief Mentor",
  "CEO", "CMO", "CCMO", "CFO", "CCO", "CTO", "COO",
  "Senior Community Mentor", "Senior Finance & Documentation Mentor",
  "Senior Operations Mentor", "Senior Marketing & Branding Mentor",
  "Senior Mentor", "Faculty Advisor","Club Lead", "Joint Club Lead"
];

const People = () => {
  const router = useRouter();
  const [society, setSociety] = useState("");
  const [people, setPeople] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: "",
    role: "",
    society: "",
  });
  const [photo, setPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Manage Execom Members | IEDC Sahrdaya"
    auth.onAuthStateChanged(async (user) => {
      if (!user) return router.push("/signin");
      const userSociety = await getSociety(user.uid);
      setSociety(userSociety);
      setNewPerson((prev) => ({ ...prev, society: userSociety }));
      fetchPeopleBySociety(userSociety, setPeople);
    });
  }, []);

  const handleCreatePerson = () => {
    if (!newPerson.name || !newPerson.role || !photo) {
      setErrorMessage("All fields are required, including the photo.");
      return;
    }
    createPerson(newPerson, photo);
    setShowModal(false);
    setNewPerson({ name: "", role: "", society });
    setPhoto(null);
    setErrorMessage("");
  };

  const handleDeletePerson = async (personId) => {
    if (window.confirm("Are you sure you want to delete this person?")) {
      await deletePerson(personId);
      fetchPeopleBySociety(society, setPeople);
    }
  };

  return (
    <Container>
      <Sidebar society={society} />
      <div style={{ flex: 1 }}>
        <Header>
          <WelcomeText>
            Welcome, {society.toUpperCase()} EXECOM Member of IEDC SAHRDAYA
          </WelcomeText>
          <SignOutButton onClick={() => auth.signOut()}>
            Sign Out
          </SignOutButton>
        </Header>
        <Content>
          <CreateButton onClick={() => setShowModal(true)}>
            Add New Members
          </CreateButton>
          <EventsHeader>
            Current Members ({people.length})
          </EventsHeader>
          <Grid>
            {people.map((person) => (
              <Card key={person.id}>
                <PersonImage src={person.mediaPath} alt={person.name} />
                <div>
                  <PersonName>{person.name}</PersonName>
                  <PersonRole>{person.role}</PersonRole>
                </div>
                <DeleteButton onClick={() => handleDeletePerson(person.id)}>
                  Delete
                </DeleteButton>
              </Card>
            ))}
          </Grid>
        </Content>
      </div>
      {showModal && (
        <Overlay>
          <Modal>
            <h2 className="text-xl font-bold text-center text-[#f97316]">
              Add New Execom Member
            </h2>
            {errorMessage && (
              <p style={{ color: "red", marginBottom: "10px" }}>
                {errorMessage}
              </p>
            )}
            <Input
              required
              placeholder="Name"
              value={newPerson.name}
              onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
            />
            <Select
              value={newPerson.role}
              onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
            >
              <option value="">Select Role</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </Select>
            <Input
              required
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
            />
            <p style={{
              color: '#92400e',
              fontSize: '0.95rem',
              fontStyle: 'italic',
              marginTop: '10px'
            }}>
              📸 **Make sure the uploaded image has a 1:1 (square) ratio for best appearance.**
            </p>
            <CreateButton onClick={handleCreatePerson}>Add Person</CreateButton>
            <CreateButton
              onClick={() => {
                setShowModal(false);
                setErrorMessage("");
              }}
            >
              Cancel
            </CreateButton>
          </Modal>
        </Overlay>
      )}
    </Container>
  );
};

export default People;
