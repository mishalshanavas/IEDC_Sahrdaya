import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  setDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../utils/firebase";
import { AboutSectionData } from "@/app/societies/[slug]/data";
import { uploadToImgBB } from './imgbbUpload';

export const handleLogin = async (formData) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      formData.email,
      formData.password
    );
    const user = userCredential.user;
    const society = await getSociety(user.uid);
    return userCredential; // Return the full userCredential
  } catch (error) {
    throw new Error(error.message);
  }
};



export const handleGoogleSignUp = async (router) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if the email ends with @sahrdaya.ac.in
    if (!user.email.endsWith('@sahrdaya.ac.in')) {
      toast.error('Only @sahrdaya.ac.in emails are allowed to sign up.');
      return; // Stop the sign-up process for invalid emails
    }

    // Check if user exists in Firebase Auth (should exist after signInWithPopup)
    // This step is mostly for completeness, signInWithPopup handles auth creation

    // Check if user exists in 'users' collection
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    // Create user document only if it doesn't exist
    if (!userDocSnapshot.exists()) {
      await setDoc(userDocRef, { email: user.email, society: "student" });
      await sendPasswordResetEmail(auth, user.email); // This line is already there, just ensure it's inside the if
      toast.info("Check your email to set a password."); // Move this line inside
    }

    // Send password reset email for new users and redirect
    if (userDocSnapshot.exists() && userDocSnapshot.data()?.society === "student") {
      router.push("/studentdashboard");
    } else if (!userDocSnapshot.exists()){
      await sendPasswordResetEmail(auth, user.email);
      router.push("/studentdashboard");
    } else {
      router.push("/dashboard");
    }

  } catch (error) {
    throw new Error(error.message);
  }
};

export const linkEmailPassword = async (user, email, password) => {
  try {
    const credential = EmailAuthProvider.credential(email, password);
    await user.linkWithCredential(credential);
    return { success: true };
  } catch (error) {
    console.error("Error linking email and password:", error);
    return { success: false, error: error.message };
  }
};



export const getSociety = async (userId) => {
  const userDocRef = doc(db, "users", userId);
  const userDocSnapshot = await getDoc(userDocRef);
  const userData = userDocSnapshot.data();
  const userSociety = userData?.society || null;
  return userSociety;
};

export const createEvent = async (formData, Poster) => {
  try {
    const imageUrl = await uploadToImgBB(Poster);
    const updatedFormData = { ...formData, mediaPath: imageUrl };
    await addDoc(collection(db, "events"), updatedFormData);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, "events", eventId));
    return true;
  } catch (error) {
    return false;
  }
};
export const fetchEventsBySociety = (society, handleEventsUpdate) => {
  const EventsRef = collection(db, "events");
  const q = query(EventsRef, where("society", "==", society));

  return onSnapshot(q, (querySnapshot) => {
    const events = [];

    querySnapshot.forEach((eventDoc) => {
      const eventData = eventDoc.data();
      const eventId = eventDoc.id;
      events.push({ id: eventId, ...eventData });
    });
    // Sort events by date, most recent first
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    handleEventsUpdate(events);
  });
};

export const fetchAllEvents = (handleEventsUpdate) => {
  const EventsRef = collection(db, "events");
  const q = query(EventsRef);

  return onSnapshot(q, (querySnapshot) => {
    const events = [];

    querySnapshot.forEach((eventDoc) => {
      const eventData = eventDoc.data();
      const eventId = eventDoc.id;
      events.push({ id: eventId, ...eventData });
    });

    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    handleEventsUpdate(events);
  });
};

export const createPerson = async (formData, Picture) => {
  try {
    const imageUrl = await uploadToImgBB(Picture);
    const updatedFormData = { ...formData, mediaPath: imageUrl };
    await addDoc(collection(db, "members"), updatedFormData);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePerson = async (personId) => {
  try {
    await deleteDoc(doc(db, "members", personId));
    return true;
  } catch (error) {
    return false;
  }
};

export const fetchPeopleBySociety = (society, handlePeopleUpdate) => {
  const Membersref = collection(db, "members");
  const q = query(Membersref, where("society", "==", society));

  return onSnapshot(q, (querySnapshot) => {
    const people = [];

    querySnapshot.forEach((doc) => {
      const personData = doc.data();
      const personId = doc.id;
      people.push({ id: personId, ...personData });
    });

    // Custom sorting function
    const sortOrder = {
      "Nodal Officer 1": 1,
"Nodal Officer 2": 2,
"Joint Coordinator": 3,
"Chief Mentor": 4,
"CEO": 5,
"CMO": 6,
"CCMO": 7,
"CFO": 8,
"CCO": 9,
"CTO": 10,
"COO": 11,
"Senior Community Mentor": 12,
"Senior Finance & Documentation Mentor": 13,
"Senior Operations Mentor": 14,
"Senior Marketing & Branding Mentor": 15,
"Faculty Advisor": 16,
"Senior Mentor": 17,
"Club Lead": 18,
"Joint Club Lead": 19

    };

    people.sort((a, b) => {
      const orderA = sortOrder[a.role] || 100;
      const orderB = sortOrder[b.role] || 100;

      if (orderA !== orderB) {
        return orderA - orderB; // Sort by predefined order
      }
      return a.name.localeCompare(b.name);
    });

    handlePeopleUpdate(people);
  });
};
export const fetchSocietyData = async (societyKey) => {
  try { 
    // Query the 'societies' collection for a document where the 'society' field matches the societyKey
    const societiesRef = collection(db, "societies");
    const q = query(societiesRef, where("society", "==", societyKey));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0]; // Assuming only one document per society name
      const data = docSnap.data();
      return { 
        id: docSnap.id, // Include the document ID
        aboutText: data.aboutText || "",
        backgroundImage: data.backgroundImage || "",
        heroImage: data.heroImage || "",
        society: data.society || "",
        email: data.email || ""
      };
    } else {
      console.log("No matching documents found in societies!");
      return {
        aboutText: "",
        backgroundImage: "",
        heroImage: "",
        society: "",
        email: ""
      };
    }
  } catch (error) {
    console.error("Error fetching society data:", error);
    throw error;
  }
};

export const getPastExecoms = async () => {
  try {
    const pastExecomCollection = collection(db, 'pastExecom');
    const yearSnapshots = await getDocs(pastExecomCollection);
    return yearSnapshots.docs.map(doc => doc.id);
  } catch (error) {
    console.error("Error fetching past execom years:", error);
    throw error; // Re-throw the error to be caught in the component
  }
};

export const createPastExecomYear = async (year) => {
  try {
    const yearDocRef = doc(db, 'pastExecom', year);
    await setDoc(yearDocRef, {}); // Create an empty document for the year
  } catch (error) {
    console.error(`Error creating past execom year ${year}:`, error);
    throw error;
  }
};

export const addPastExecomMember = async (year, memberData) => {
  try {
    const membersCollectionRef = collection(db, 'pastExecom', year, 'members');
    // If memberData includes a file for mediaPath, upload it first
    if (memberData.mediaPath instanceof File) {
      const imageUrl = await uploadToImgBB(memberData.mediaPath);
      memberData.mediaPath = imageUrl;
    }
    await addDoc(membersCollectionRef, memberData);
  } catch (error) {
    console.error(`Error adding member for year ${year}:`, error);
    throw error;
  }
};

export const updatePastExecomMember = async (year, memberId, updatedMemberData) => {
  try {
    const memberDocRef = doc(db, 'pastExecom', year, 'members', memberId);
        // If updatedMemberData includes a file for mediaPath, upload it first
    if (updatedMemberData.mediaPath instanceof File) {
      const imageUrl = await uploadToImgBB(updatedMemberData.mediaPath);
      updatedMemberData.mediaPath = imageUrl;
    }
    await updateDoc(memberDocRef, updatedMemberData);
  } catch (error) {
    console.error(`Error updating member ${memberId} for year ${year}:`, error);
    throw error;
  }
};

export const deletePastExecomMember = async (year, memberId) => {
  const memberDocRef = doc(db, 'pastExecom', year, 'members', memberId);
  await deleteDoc(memberDocRef);
};

// Gallery Image Management Functions

export const addGalleryImage = async (imageData, imageFile) => {
  try {
    const imageUrl = await uploadToImgBB(imageFile);
    const timestamp = new Date().toISOString(); // Add a timestamp
    const dataToSave = { ...imageData, imageUrl, timestamp };
    await addDoc(collection(db, 'gallery'), dataToSave);
  } catch (error) {
    console.error('Error adding gallery image:', error);
    throw error;
  }
};

export const getPastExecomMembersByYear = async (year) => {
  try {
    const membersCollectionRef = collection(db, 'pastExecom', year, 'members');
    const memberSnapshots = await getDocs(membersCollectionRef);
    return memberSnapshots.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching members for year ${year}:`, error);
    throw error;
  }
};

export const updateGalleryImage = async (imageId, updatedData, imageFile) => {
  try {
    const imageRef = doc(db, 'gallery', imageId);
    const updateObject = { ...updatedData };

    if (imageFile) {
      const newImageUrl = await uploadToImgBB(imageFile);
      updateObject.imageUrl = newImageUrl;
    }

    await updateDoc(imageRef, updateObject);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    throw error;
  }
};

export const deleteGalleryImage = async (imageId) => {
  const imageRef = doc(db, 'gallery', imageId);
  await deleteDoc(imageRef);
};

export const fetchGalleryImages = async () => {
  try {
    const galleryRef = collection(db, "gallery");
    // Add orderBy to sort by timestamp in descending order
    const q = query(galleryRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    throw error;
  }
};

export const deleteUpcomingEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, "upcoming", eventId));
  } catch (error) {
    console.error("Error deleting upcoming event:", error);
    throw error;
  }
};

export const updateUpcomingEvent = async (eventId, updatedFields) => {
  try {
    const eventRef = doc(db, "upcoming", eventId);
    await updateDoc(eventRef, updatedFields);
  } catch (error) {
    console.error("Error updating upcoming event:", error);
  }
};

export const getUpcomingEvents = async () => {
  try {
    const upcomingEventsRef = collection(db, "upcoming");
    const snapshot = await getDocs(upcomingEventsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    throw error;
  }
};

export const addUpcomingEvent = async (eventData) => {
  try {
    await addDoc(collection(db, "upcoming"), eventData);
  } catch (error) {
    console.error("Error adding upcoming event:", error);
    throw error;
  }
};


export const fetchSocietyDataById = async (documentId) => {
  try {
    // Fetch the document directly from the 'societies' collection using the documentId
    const societyRef = doc(db, "societies", documentId);
    const docSnap = await getDoc(societyRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id, // Include the document ID
        aboutText: data.aboutText || "",
        backgroundImage: data.backgroundImage || "",
        heroImage: data.heroImage || "",
        society: data.society || "",
        email: data.email || ""
      };
    } else {
      console.log(`No document found with ID: ${documentId}`);
      return null; // Return null if no document is found
    }
  } catch (error) {
    console.error("Error fetching society data by ID:", error);
    throw error;
  }
};
export const updateSocietyData = async (society, newData) => {
  try {
    // Query the 'societies' collection to find the document with the matching 'society' field
    const societiesRef = collection(db, "societies");
    const q = query(societiesRef, where("society", "==", society));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("Society document does not exist for the given society code!");
    }

    const societyDoc = querySnapshot.docs[0]; // Get the first document from the query result
    const societyRef = doc(db, "societies", societyDoc.id); // Use the document's ID
    const societySnap = await getDoc(societyRef); // Fetch the document again using its ID to confirm existence (optional but safe)
    if (!societySnap.exists()) {
      throw new Error("Society document does not exist!");
    }

    const updateObject = {
      aboutText: newData.aboutText,
      backgroundImage: typeof newData.backgroundImage === "string"
        ? newData.backgroundImage
        : await uploadToImgBB(newData.backgroundImage),
      heroImage: typeof newData.heroImage === "string"
        ? newData.heroImage
        : await uploadToImgBB(newData.heroImage),
    };

    await updateDoc(societyRef, updateObject);
    return updateObject;
  } catch (error) {
    console.error("Error updating society data:", error);
    throw error;
  }
};

export const fetchAllPeople = async () => {
  try {
    const peopleRef = collection(db, "members");
    const snapshot = await getDocs(peopleRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching all people:", error);
    throw error;
  }
};