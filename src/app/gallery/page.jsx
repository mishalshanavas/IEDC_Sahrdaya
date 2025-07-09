"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "react-modal";
import GalleryNavbar from "@/components/GalleryNavbar";
import { fetchGalleryImages } from "@/utils/FirebaseFunctions";
import LoadingOverlay from "@/components/LoadingOverlay";

// Adjusted modal styles to reduce space
const modalStyles = {
  content: {
    backgroundColor: '#fff7ed',
    borderRadius: '10px',
    padding: '5px', // Further reduced padding
    border: '1px solid #f97316',
    maxWidth: '450px', // Further reducing width for a smaller modal
    margin: 'auto', // Centering the modal
    maxHeight: '50vh', // Limit the maximum height of the modal to 80% of the viewport height
    height: 'auto', // Allow height to adjust to content
    overflow: 'auto', // Add scrollbars if content overflows
    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.3)',
    zIndex: 100,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker overlay for contrast
    zIndex: 99,
  }
};
 
const GalleryPage = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Modal.setAppElement("body");
    }
  }, []);

  useEffect(() => {
    const getImages = async () => {
      try {
        const images = await fetchGalleryImages();
        setGalleryImages(images);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    getImages();
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <GalleryNavbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Gallery</h1>
        {galleryImages.length === 0 ? (
          <p className="text-center text-gray-600">Nothing to see here… yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div
                key={image.id}
                className="relative w-full h-64 overflow-hidden rounded-lg shadow-md cursor-pointer bg-gray-100"
                onClick={() => openModal(image)}
              >
                <Image
                  src={image.imageUrl}
                  alt={image.caption || "Gallery Image"}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Image Details"
          style={modalStyles} // Adjusted modal style for smaller box
        >
          <div className="flex flex-col items-center justify-center"> {/* Removed w-full */}
            <Image
              src={selectedImage.imageUrl}
              alt={selectedImage.caption || "Gallery Image"}
              width={320} // Reduced image width for a more compact modal
              height={240} // Reduced image height
              objectFit="contain"
              className="flex-shrink-0" // Added flex-shrink-0 to the Image component
            />
            {selectedImage.caption && (
              <p className="mt-2 mb-1 text-center text-orange-700 font-semibold flex-shrink-0">{selectedImage.caption}</p> // Added flex-shrink-0
)}
            {selectedImage.timestamp && (
              <p className="mt-2 text-center text-gray-600 text-sm">
                Uploaded: {new Date(selectedImage.timestamp).toLocaleString()}
              </p>
            )}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700"
            >
              &times;
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default GalleryPage;
