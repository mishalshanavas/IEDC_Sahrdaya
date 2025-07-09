"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/utils/firebase";
import { uploadToImgBB } from "@/utils/imgbbUpload";
import {
  
  getPastExecoms,
  getPastExecomMembersByYear,
  addPastExecomMember,
  createPastExecomYear,
  getSociety, updatePastExecomMember,
} from "@/utils/FirebaseFunctions";

// Layout Containers
const Container = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  background-color: #fffaf0;

  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #fffaf0;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: linear-gradient(to right, #f97316, #facc15);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WelcomeText = styled.h1`
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
`;

const YearSection = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
`;

const InputSection = styled.div`
  input {
    padding: 10px;
    margin-top: 5px;
    margin-right: 10px;
    border: 1px solid #fcd34d;
    border-radius: 5px;
  }

  button {
    padding: 10px 16px;
    background-color: #f97316;
    color: white;
    border: none;
    border-radius: 6px;
    margin-top: 10px;
    cursor: pointer;

    &:hover {
      background-color: #fb923c;
    }
  }
`;

const SelectYearWrapper = styled.div`
  label {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }

  select {
    padding: 10px;
    border-radius: 6px;
    background-color: #f97316;
    color: white;
    border: none;

    &:focus {
      outline: none;
    }
  }
`;

const MemberCard = styled.div`
  width: 200px;
  text-align: center;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const MemberImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const MemberInfo = styled.div`

  padding: 10px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  color: #f97316;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  button {
    padding: 8px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }

  button:first-child {
    background-color: #ccc;
    color: #333;

    &:hover {
      background-color: #bbb;
    }
  }

  button:last-child {
    background-color: #f97316;
    color: white;

    &:hover {
      background-color: #fb923c;
    }
  }
`;

const AddMemberButton = styled.button`
  padding: 10px 16px;
  background-color: #f97316;
  color: white;
  border: none;
  border-radius: 6px;
  margin-top: 20px; /* Added margin to separate from YearSection */
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #fb923c;
  }
`;


const ErrorText = styled.p`
  color: red;
`;

const PastExecomDashboard = () => {
  const [society, setSociety] = useState("");
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [members, setMembers] = useState([]);
  const [newYear, setNewYear] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [memberForm, setMemberForm] = useState({ name: "", role: "", society: "", mediaPath: "" });
  const [loading, setLoading] = useState(true);

  const [imageUploading, setImageUploading] = useState(false); // State to track image upload

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      const soc = await getSociety(user.uid);
      setSociety(soc);

      try {
        const yearList = await getPastExecoms();
        setYears(yearList);
        setSelectedYear(yearList[0] || "");
      } catch (err) {
        setErrorMessage("Error loading years.");
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    const fetchMembers = async () => {
      try {
        const memberList = await getPastExecomMembersByYear(selectedYear);
        setMembers(memberList);
      } catch (err) {
        setErrorMessage("Error fetching members.");
      }
    };
    fetchMembers();
  }, [selectedYear]);

  const handleCreateYear = async () => {
    if (!newYear.trim()) return toast.error("Enter a valid year.");

    try {
      await createPastExecomYear(newYear);
      setYears([...years, newYear]);
      setSelectedYear(newYear);
      setNewYear("");
      toast.success("Year created successfully!");
    } catch (err) {
      toast.error("Failed to create year.");
    }
  };

  const handleAddMemberClick = () => {
    setIsEditing(false);
    setCurrentMember(null);
    setMemberForm({ name: "", role: "", society: "", mediaPath: "" });
    setIsModalOpen(true);
    // Clear any previous image preview
  };

  const handleEditMemberClick = (member) => {
    setIsEditing(true);
    setCurrentMember(member);
    setMemberForm({ name: member.name, role: member.role, society: member.society, mediaPath: member.mediaPath });
    setIsModalOpen(true);
  };


  const handleDeleteMemberClick = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        // Placeholder for delete functionality
        setMembers(members.filter(member => member.id !== memberId));
        toast.success("Member deleted successfully!");
      } catch (err) {
        toast.error("Failed to delete member.");
      }
    }
  };

  const handleSaveMember = async () => {
    if (!memberForm.name || !memberForm.role || !memberForm.society || !memberForm.mediaPath) {
      return toast.error("Please fill in all member details.");
    }

    try {
      let finalMemberForm = { ...memberForm };

      // If mediaPath is a File, upload it
      if (memberForm.mediaPath instanceof File) {
        setImageUploading(true);
        const imageUrl = await uploadToImgBB(memberForm.mediaPath);
        finalMemberForm.mediaPath = imageUrl;
        setImageUploading(false);
      }

      if (isEditing) {
        // Use the actual update function
        await updatePastExecomMember(selectedYear, currentMember.id, finalMemberForm);
        setMembers(members.map(member => member.id === currentMember.id ? { id: currentMember.id, ...finalMemberForm } : member));
        toast.success("Member updated successfully!");
      } else {
        // Use the actual add function
        await addPastExecomMember(selectedYear, finalMemberForm);
        // Re-fetch members to get the correct ID from Firebase
        const updatedMembers = await getPastExecomMembersByYear(selectedYear);
        setMembers(updatedMembers);
        toast.success("Member added successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${isEditing ? "update" : "add"} member.`);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberForm({ ...memberForm, mediaPath: file });
    }
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Container>
      <Sidebar society={society} />
      <div style={{ flex: 1 }}>
        <Header>
          <WelcomeText>
            Welcome, {society.toUpperCase()} Execom Member of IEDC SAHRDAYA
          </WelcomeText>
        </Header>

        <Content>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f97316" }}>
            Past Execom Dashboard
          </h2>

          <YearSection>
            <InputSection>
              <h3>Create New Year</h3>
              <input
                type="text"
                placeholder="e.g., 2023-24"
                value={newYear}
                onChange={(e) => setNewYear(e.target.value)}
              />
              <button onClick={handleCreateYear}>Create Year</button>
            </InputSection>

            <SelectYearWrapper>
              <label>Select Year:</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </SelectYearWrapper>
          </YearSection>

          <AddMemberButton onClick={handleAddMemberClick}>Add New Member</AddMemberButton>

          {loading ? (
            <p>Loading...</p>
          ) : errorMessage ? (
            <ErrorText>{errorMessage}</ErrorText>
          ) : (
            <div>
              <h3>Members of {selectedYear}</h3>
              {members.length > 0 ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginTop: "10px" }}>
                  {members.map((member) => (
                    <MemberCard key={member.id}>
                      <MemberImage src={member.mediaPath} alt={member.name} />
                      <MemberInfo>
                        <h4>{member.name}</h4>
                        <p>{member.role}</p>
                        <div style={{ marginTop: "10px" }}>
                          <button
                            onClick={() => handleEditMemberClick(member)}
                            style={{ marginRight: "5px", padding: "5px 10px", backgroundColor: "#fb923c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteMemberClick(member.id)}
                            style={{ padding: "5px 10px", backgroundColor: "#fb923c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                          >
                            Delete
                          </button>
                        </div>
                      </MemberInfo>
                    </MemberCard>
                  ))}
                </div>
              ) : (
                <p>No members found for {selectedYear}.</p>
              )}
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <ModalOverlay>
              <ModalContent>
                <ModalTitle>{isEditing ? "Edit Member" : "Add New Member"}</ModalTitle>
                <FormGroup>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="role">Role:</label>
                  <input
                    type="text"
                    id="role"
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="society">Society:</label>
                  <input
                    type="text"
                    id="society"
                    value={memberForm.society}
                    onChange={(e) => setMemberForm({ ...memberForm, society: e.target.value })}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="mediaPath">Upload Member Image:</label>
                  {/* Always render file input for simplicity. The handleImageChange will update state. */}
                    <input type="file" accept="image/*" onChange={handleImageChange} />

                  {/* Show current image or uploading message */}
                  {imageUploading && <p>Uploading image...</p>}

                  {/* Show image preview if mediaPath is a string (URL) and not currently uploading,
                      and if it's editing mode OR it's add mode but an image has been selected (a File object)
                      The condition `!(!isEditing || (isEditing && memberForm.mediaPath instanceof File))`
                      was complex. Let's simplify to show preview if mediaPath is string and not uploading.
                  */}
                  {memberForm.mediaPath && typeof memberForm.mediaPath === 'string' && !imageUploading && (
                    <img src={memberForm.mediaPath} alt="Member Preview" style={{ maxWidth: '100%', marginTop: '10px' }} />
)}
                </FormGroup>
                <ModalActions>
                  <button onClick={handleCloseModal}>Cancel</button>
                  <button onClick={handleSaveMember}>Save</button>
                </ModalActions>
              </ModalContent>
            </ModalOverlay>
          )}
        </Content>
      </div>
    </Container>
  );
};

export default PastExecomDashboard;
