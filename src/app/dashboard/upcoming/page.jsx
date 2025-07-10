"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import {
  getUpcomingEvents,
  updateUpcomingEvent,
  addUpcomingEvent,
  deleteUpcomingEvent
} from "@/utils/FirebaseFunctions";
import { uploadToImgBB } from "@/utils/imgbbUpload";
import styled from "styled-components";
import { auth } from "@/utils/firebase";
import { getSociety } from "@/utils/FirebaseFunctions";
import { useRouter } from "next/navigation";

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

const UpcomingEventsDashboard = () => {
  const router = useRouter();
  const [Society, setSociety] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingEvent, setEditingEvent] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [editedFile, setEditedFile] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEventData, setNewEventData] = useState({});

  useEffect(() => {
    document.title = "Upcoming Events Dashboard | IEDC Sahrdaya";
    auth.onAuthStateChanged(async (user) => {
      if (!user) return router.push("/signin");
      const userSociety = await getSociety(user.uid);
      setSociety(userSociety);
    });
  }, [router]);

  useEffect(() => {
    if (Society) fetchEvents();
  }, [Society]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const events = await getUpcomingEvents();
      setUpcomingEvents(events);
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fillBlanksWith404 = (data) => {
    const newData = { ...data };
    Object.keys(newData).forEach((key) => {
      if (newData[key] === "" || newData[key] == null) {
        newData[key] = "404";
      }
    });
    return newData;
  };

  const handleEditClick = (event) => {
    setEditingEvent(event.id);
    setEditedData({ ...event });
    setEditedFile(null);
  };

  const handleCancelClick = () => {
    setEditingEvent(null);
    setEditedData({});
    setEditedFile(null);
  };

  const handleEditFileChange = (e) => {
    setEditedFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
  };

  const handleSaveClick = async (eventId) => {
    try {
      let dataToUpdate = fillBlanksWith404({ ...editedData });
      if (editedFile) {
        const uploadedUrl = await uploadToImgBB(editedFile);
        dataToUpdate.mediaPath = uploadedUrl;
      }
      await updateUpcomingEvent(eventId, dataToUpdate);
      setUpcomingEvents(
        upcomingEvents.map((event) =>
          event.id === eventId ? { ...event, ...dataToUpdate } : event
        )
      );
      setEditingEvent(null);
      setEditedData({});
      setEditedFile(null);
    } catch (error) {
      console.error("Error updating upcoming event:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteUpcomingEvent(eventId);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting upcoming event:", error);
    }
  };

  const handleAddClick = () => {
    setShowAddForm(true);
    setNewEventData({
      title: "",
      date: "",
      Society: "",
      description: "",
      mediaPath: null,
      meetlink: "",
      mode: "Offline",
      needReg: "False",
      regLink: "",
      venue: "",
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewEventData({ ...newEventData, [name]: value });
  };

  const handleAddFileChange = (e) => {
    setNewEventData({ ...newEventData, mediaPath: e.target.files[0] });
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataToSave = fillBlanksWith404({ ...newEventData });
      if (dataToSave.mediaPath instanceof File) {
        dataToSave.mediaPath = await uploadToImgBB(dataToSave.mediaPath);
      }
      await addUpcomingEvent(dataToSave);
      setShowAddForm(false);
      fetchEvents();
    } catch (error) {
      console.error("Error adding upcoming event:", error);
    }
  };

  if (loading) {
    return <p className="p-4">Loading upcoming events...</p>;
  }

  return (
    <Container>
      <Sidebar society={Society} />
      <div style={{ flex: 1 }}>
        <Header>
          <WelcomeText>
            Welcome, {Society.toUpperCase()} Execom Members of IEDC SAHRDAYA
          </WelcomeText>
          <SignOutButton onClick={() => auth.signOut()}>Sign Out</SignOutButton>
        </Header>
        <Content>
          <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 border border-yellow-400">
            <h1 className="text-3xl font-bold mb-6 text-orange-600">Upcoming Events Dashboard</h1>
            <button
              onClick={handleAddClick}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mb-6 transition"
            >
              + Add New Event
            </button>

            {showAddForm && (
              <div className="mb-8 p-4 border border-yellow-400 rounded-lg bg-yellow-50">
                <h2 className="text-xl font-semibold mb-4 text-orange-600">Add New Event</h2>
                <p className="text-sm text-gray-600 mb-2">
                  Do not leave anything empty—type 404 if nothing is there.
 </p>
                <form onSubmit={handleAddFormSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      ["Title", "title", "text"],
                      ["Date", "date", "date"],
                      ["Club", "Society", "text"],
                      ["Description", "description", "textarea"],
                      ["Media Path", "mediaPath", "file"],
                      ["Meet Link", "meetlink", "text"],
                      ["Venue", "venue", "text"]
                    ].map(([label, name, type]) => (
                      <div key={name}>
                        <label className="block text-gray-700">{label}</label>
                        {type === "textarea" ? (
                          <textarea
                            name={name}
                            value={newEventData[name] || ""}
                            onChange={handleAddInputChange}
                            className="border p-2 rounded w-full"
                            rows="3"
                          />
                        ) : type === "file" ? (
                          <input
                            type="file"
                            name={name}
                            onChange={handleAddFileChange}
                            className="border p-2 rounded w-full"
                          />
                        ) : (
                          <input
                            type={type}
                            name={name}
                            value={newEventData[name] || ""}
                            onChange={handleAddInputChange}
                            className="border p-2 rounded w-full"
                          />
                        )}
                      </div>
                    ))}
                    <div>
                      <label className="block text-gray-700">Mode</label>
                      <select
                        name="mode"
                        value={newEventData.mode || "Offline"}
                        onChange={handleAddInputChange}
                        className="border p-2 rounded w-full"
                      >
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700">Need Registration</label>
                      <select
                        name="needReg"
                        value={newEventData.needReg || "False"}
                        onChange={handleAddInputChange}
                        className="border p-2 rounded w-full"
                      >
                        <option value="True">True</option>
                        <option value="False">False</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700">Registration Link</label>
                      <input
                        type="text"
                        name="regLink"
                        value={newEventData.regLink || ""}
                        onChange={handleAddInputChange}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                    >
                      Add Event
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {upcomingEvents.map((event) =>
                editingEvent === event.id ? (
                  <div key={event.id} className="mb-8 p-4 border border-yellow-400 rounded-lg bg-yellow-50">
                    <h2 className="text-xl font-semibold mb-4 text-orange-600">Edit Event</h2>
                    <p className="text-sm text-gray-600 mb-2">
                     Do not leave anything empty—type 404 if nothing is there.
 </p>
                    <form onSubmit={(e) => { e.preventDefault(); handleSaveClick(event.id); }}>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {[
                      ["Title", "title", "text"],
                      ["Date", "date", "date"],
                      ["Club", "Society", "text"],
                      ["Description", "description", "textarea"],
                      ["Media Path", "mediaPath", "file"],
                      ["Meet Link", "meetlink", "text"],
                      ["Venue", "venue", "text"]
 ].map(([label, name, type]) => (
 <div key={name}>
 <label className="block text-gray-700">{label}</label>
                        {type === "textarea" ? (
 <textarea
                              name={name}
                              value={editedData[name] || ""}
                              onChange={handleInputChange}
                              className="border p-2 rounded w-full"
                              rows="3"
 />
 ) : type === "file" ? (
 <input
 type="file"
                              name={name}
                              onChange={handleEditFileChange}
 className="border p-2 rounded w-full"
 />
 ) : (
 <input
                              type={type}
                              name={name}
                              value={editedData[name] || ""}
                              onChange={handleInputChange}
 className="border p-2 rounded w-full"
 />
 )}
 </div>
 ))}
 <div>
 <label className="block text-gray-700">Mode</label>
 <select
                          name="mode"
                          value={editedData.mode || "Offline"}
                          onChange={handleInputChange}
 className="border p-2 rounded w-full"
 >
 <option value="Online">Online</option>
 <option value="Offline">Offline</option>
 </select>
 </div>
 <div>
 <label className="block text-gray-700">Need Registration</label>
 <select
                          name="needReg"
                          value={editedData.needReg || "False"}
                          onChange={handleInputChange}
 className="border p-2 rounded w-full"
 >
 <option value="True">True</option>
 <option value="False">False</option>
 </select>
 </div>
 <div>
 <label className="block text-gray-700">Registration Link</label>
 <input
 type="text"
                          name="regLink"
                          value={editedData.regLink || ""}
                          onChange={handleInputChange}
 className="border p-2 rounded w-full"
 />
 </div>
 </div>
 <div className="mt-4 flex space-x-2">
 <button
 type="submit"
 className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
 >
 Save Changes
 </button>
 <button
 type="button"
 onClick={handleCancelClick}
 className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
 >
 Cancel
 </button>
 </div>
                    </form>
                  </div>
                ) : (
                  <div key={event.id} className="flex items-center border rounded-lg shadow p-4 bg-white">
                    <div className="flex-shrink-0 w-16 h-16 flex flex-col items-center justify-center rounded bg-gradient-to-b from-orange-400 to-yellow-400 text-white font-bold text-lg">
                      <span>{new Date(event.date).getDate()}</span>
                      <span className="text-xs">{new Date(event.date).toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                      <span className="text-xs">{new Date(event.date).getFullYear()}</span>
                    </div>
                    <div className="flex-1 ml-4">
                      <h3 className="text-orange-600 font-bold text-lg">{event.title}</h3>
                      <p className="text-gray-800">{event.description}</p>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      <button
                        onClick={() => handleEditClick(event)}
                        className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </Content>
      </div>
    </Container>
  );
};

export default UpcomingEventsDashboard;
