"use client";

import { useState, useEffect, Fragment } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";
import { Dialog, Transition } from '@headlessui/react';
import { fetchAllEvents } from "@/utils/FirebaseFunctions";
import Navbar from "@/components/Navbar/Navbar";
import { IoClose } from "react-icons/io5";

const EventsContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: auto;
  padding: 2rem 0;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const EventCardWrapper = styled(motion.div)`
  border-radius: 16px;
  overflow: hidden;
  background: #fffaf0;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(249, 115, 22, 0.2);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: ${props =>
    props.active
      ? 'linear-gradient(to right, #f97316, #facc15)'
      : '#fff'};
  color: ${props => (props.active ? '#fff' : '#f97316')};
  border: 1px solid #f97316;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.active
        ? 'linear-gradient(to right, #ea580c, #eab308)'
        : '#fff7ed'};
    color: ${props => (props.active ? '#fff' : '#f97316')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ViewAllButton = styled.button`
  background: linear-gradient(to right, #f97316, #facc15);
  color: white;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;

  &:hover {
    background: linear-gradient(to right, #ea580c, #eab308);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ViewDetailsButton = styled.button`
  background: linear-gradient(to right, #f97316, #facc15);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: linear-gradient(to right, #ea580c, #eab308);
    box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
`;

const Modal = styled(Dialog)`
  position: fixed;
  z-index: 50;
  inset: 0;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
`;

const ModalContent = styled.div`
  position: relative;
  background: #fffaf0;
  border-radius: 16px;
  max-width: 1000px;
  width: 90%;
  margin: 2rem auto;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(249, 115, 22, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  color: #78350f;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 50;

  &:hover {
    color: #7c2d12;
    transform: rotate(90deg);
  }
`;

const EventTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(to right, #f97316, #facc15);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const EventDescription = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  color: #78350f;
  white-space: pre-wrap;
  text-align: justify;
`;

const EventMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #92400e;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 12px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 3rem;
`;

const SOCIETIES_MAP = [
  { code: "cod", name: "Coders Club" },
  { code: "hdw", name: "Hardware Club" },
];

function EventCard({ event, index, inView }) {
  const [isOpen, setIsOpen] = useState(false);
  const societyInfo = SOCIETIES_MAP.find(s => s.code === event.society);
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <EventCardWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="aspect-video relative">
          <img
            src={event.mediaPath}
            alt={event.title}
            className="absolute w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="font-bold text-xl mb-2 text-orange-700">{event.title}</h2>
          <p className="text-sm text-orange-500 mb-2">{formattedDate}</p>
          <p className="text-sm text-orange-600 mb-3">
            {societyInfo ? societyInfo.name : event.society.toUpperCase()}
          </p>
          <ViewDetailsButton onClick={() => setIsOpen(true)}>
            View Details
          </ViewDetailsButton>
        </div>
      </EventCardWrapper>

      <Transition show={isOpen} as={Fragment}>
  <Modal onClose={() => setIsOpen(false)}>
    <Transition.Child
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <ModalOverlay />
    </Transition.Child>

    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <ModalContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b-2 border-orange-200 pb-4">
                <EventTitle>{event.title}</EventTitle>
                <CloseButton onClick={() => setIsOpen(false)}>
                  <IoClose size={28} />
                </CloseButton>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <ImageContainer>
                  <img
                    src={event.mediaPath}
                    alt={event.title}
                    loading="lazy"
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 6px 20px rgba(249, 115, 22, 0.2)',
                      border: '3px solid #fed7aa',
                    }}
                  />
                </ImageContainer>

                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="space-y-4">
                    <EventMetadata>
                      <span
                        style={{
                          background: 'linear-gradient(to right, #f97316, #facc15)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        📅
                      </span>
                      <span>{formattedDate}</span>
                    </EventMetadata>

                    <EventMetadata>
                      <span
                        style={{
                          background: 'linear-gradient(to right, #f97316, #facc15)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        🏛️
                      </span>
                      <span>{societyInfo ? societyInfo.name : event.society.toUpperCase()}</span>
                    </EventMetadata>

                    <hr
                      style={{
                        borderTop: '2px dashed #f97316',
                        margin: '1rem 0',
                      }}
                    />

                    <div className="pt-2">
                      <h3 className="text-sm font-semibold text-orange-500 mb-2">
                        About the Event
                      </h3>
                      <EventDescription>{event.description}</EventDescription>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </ModalContent>
        </Transition.Child>
      </div>
    </div>
  </Modal>
</Transition>

    </>
  );
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 9;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        fetchAllEvents(setEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events?.slice(indexOfFirstEvent, indexOfLastEvent) || [];
  const totalPages = Math.ceil((events?.length || 0) / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <EventsContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-video bg-orange-100 rounded-t-lg" />
              <div className="p-4 bg-orange-50 rounded-b-lg">
                <div className="h-4 bg-orange-100 rounded w-3/4 mb-2" />
                <div className="h-4 bg-orange-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </EventsContainer>
    );
  }

  return (
    <>
      <Navbar />
      <EventsContainer>
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          style={{
            background: 'linear-gradient(to right, #f97316, #facc15)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Events & Activities
        </motion.h1>
        <EventsGrid ref={ref}>
          {currentEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} inView={inView} />
          ))}
        </EventsGrid>
        <ButtonContainer>
          <PaginationContainer>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </PageButton>
            {[...Array(totalPages)].map((_, index) => (
              <PageButton
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PageButton>
            ))}
            <PageButton
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </PageButton>
          </PaginationContainer>
        </ButtonContainer>
      </EventsContainer>
    </>
  );
}

export default EventsPage;
