"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  fetchGalleryImages,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getSociety,
} from "@/utils/FirebaseFunctions";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";

// Styled Components for Layout
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
  background-color: #ffffff;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;\n  align-items: center;
  padding: 10px 20px;
  background: linear-gradient(to right, #f97316, #facc15);
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

// Styled Component for the "Add New Image" button
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s, transform 0.1s;

  &:hover {
    background-color: #fb923c;
    transform: scale(1.02);
  }
`;

// Styled Components for Gallery Display
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const GalleryItem = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GalleryImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
`;

const GalleryCaption = styled.p`
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
  color: #333;
`;

// Styled Component for the button container
const ActionButtons = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
`;

// Styled Components for Modals
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

// Styled Components for Form Inputs
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

const Textarea = styled.textarea`
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

const DashboardGallery = () => {
  const router = useRouter();
  const [society, setSociety] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newImageData, setNewImageData] = useState({ caption: "" });
  const [newImageFile, setNewImageFile] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [editedImageData, setEditedImageData] = useState({ caption: "" });
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Manage Gallery | IEDC Sahrdaya";
    auth.onAuthStateChanged(async (user) => {
      if (!user) {
        return router.push("/signin");
      }
      const userSociety = await getSociety(user.uid);
      setSociety(userSociety);
      // Fetch all gallery images
      fetchGalleryImagesData();
    });
  }, []);

  const fetchGalleryImagesData = async () => {
    try {
      setLoading(true);
      const images = await fetchGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setErrorMessage("Failed to fetch gallery images.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImageFile) {
      setErrorMessage("Please select an image file.");
      return;
    }
    try {
      await addGalleryImage(newImageData, newImageFile);
      setShowAddModal(false);
      setNewImageData({ caption: "" });
      setNewImageFile(null);
      setErrorMessage("");
      fetchGalleryImagesData(); // Refresh the gallery list
    } catch (error) {
      console.error("Error adding gallery image:", error);
      setErrorMessage("Failed to add gallery image.");
    }
  };

  const handleEditClick = (image) => {
    setEditingImage(image);
    setEditedImageData({ caption: image.caption || "" });
    setEditedImageFile(null);
    setShowEditModal(true);
  };

  const handleUpdateImage = async () => {
    if (!editingImage) return;

    try {
      await updateGalleryImage(editingImage.id, editedImageData, editedImageFile);
      setShowEditModal(false);
      setEditingImage(null);
      setEditedImageData({ caption: "" });
      setEditedImageFile(null);
      setErrorMessage("");
      fetchGalleryImagesData(); // Refresh the gallery list
    } catch (error) {
      console.error("Error updating gallery image:", error);
      setErrorMessage("Failed to update gallery image.");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteGalleryImage(imageId);
        fetchGalleryImagesData(); // Refresh the gallery list
      } catch (error) {
        console.error("Error deleting gallery image:", error);
        setErrorMessage("Failed to delete gallery image.");
      }
    }
  };

  if (loading) {
    return <p>Loading gallery management...</p>;
  }

  return (
    <Container>
      <Sidebar society={society} />
      <div style={{ flex: 1 }}>
        <Header>
          <WelcomeText>
            Welcome, {society.toUpperCase()} Execom Member of IEDC SAHRDAYA
          </WelcomeText>
          <SignOutButton onClick={() => auth.signOut()}>
            Sign Out
          </SignOutButton>
        </Header>
        <Content>
          <CreateButton onClick={() => setShowAddModal(true)}>
            Add New Image
          </CreateButton>

          {errorMessage && (
            <p style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</p>
          )}

          <GalleryGrid>
            {galleryImages.map((image) => (
              <GalleryItem key={image.id}>
                <GalleryImageContainer>
                  <Image
                    src={image.imageUrl}
                    alt={image.caption || "Gallery Image"}
                    layout="fill"
                    objectFit="cover"
                  />
                </GalleryImageContainer>
                <GalleryCaption>{image.caption || "No Caption"}</GalleryCaption>
                <ActionButtons>
                  <CreateButton onClick={() => handleEditClick(image)}>Edit</CreateButton>
                  <CreateButton onClick={() => handleDeleteImage(image.id)}>Delete</CreateButton>
                </ActionButtons>
              </GalleryItem>
            ))}
          </GalleryGrid>

          {/* Add Image Modal */}
          {showAddModal && (
            <Overlay>
              <Modal>
                <h2 className="text-xl font-bold text-center text-[#f97316]">
                  Add New Gallery Image
                </h2>
                {errorMessage && (
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {errorMessage}
                  </p>
                )}
                <Textarea
                  placeholder="Caption (Optional)"
                  value={newImageData.caption}
                  onChange={(e) =>
                    setNewImageData({ ...newImageData, caption: e.target.value })
                  }
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewImageFile(e.target.files[0])}
                />
                 {newImageFile && (
                    <p className="text-sm text-gray-600 mt-2">Selected file: {newImageFile.name}</p>
                 )}
                <CreateButton onClick={handleAddImage}>Add Image</CreateButton>
                <CreateButton onClick={() => { setShowAddModal(false); setErrorMessage(""); }}>
                  Cancel
                </CreateButton>
              </Modal>
            </Overlay>
          )}

          {/* Edit Image Modal */}
          {showEditModal && editingImage && (
            <Overlay>
              <Modal>
                <h2 className="text-xl font-bold text-center text-[#f97316]">
                  Edit Gallery Image
                </h2>
                 {errorMessage && (
                  <p style={{ color: "red", marginBottom: "10px" }}>
                    {errorMessage}
                  </p>
                )}
                <Textarea
                  placeholder="Caption (Optional)"
                  value={editedImageData.caption}
                  onChange={(e) =>
                    setEditedImageData({ ...editedImageData, caption: e.target.value })
                  }
                />
                <p className="text-sm text-gray-700 mb-2">Current Image:</p>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={editingImage.imageUrl}
                    alt="Current Gallery Image"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                 <p className="text-sm text-gray-700 mb-2">Replace Image (Optional):</p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditedImageFile(e.target.files[0])}
                />
                 {editedImageFile && (
                    <p className="text-sm text-gray-600 mt-2">Selected file: {editedImageFile.name}</p>
                 )}
                <CreateButton onClick={handleUpdateImage}>Save Changes</CreateButton>
                <CreateButton onClick={() => { setShowEditModal(false); setEditingImage(null); setErrorMessage(""); }}>
                  Cancel
                </CreateButton>
              </Modal>
            </Overlay>
          )}
        </Content>
      </div>
    </Container>
  );
};

export default DashboardGallery;