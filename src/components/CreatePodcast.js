// components/CreatePodcast.js
import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

export default function CreatePodcast() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const imageRef = ref(
        storage,
        `podcasts/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(imageRef, bannerImage);

      const imageURL = await getDownloadURL(imageRef);
      const podcastData = {
        title,
        description,
        bannerImage: imageURL,
        createdBy: auth.currentUser.uid,
      };

      const docRef = await addDoc(collection(db, "podcasts"), podcastData);
      alert("Podcast created successfully!");

      // Redirect to the podcast details page
      navigate(`/podcast/${docRef.id}`);
      setTitle("");
      setDescription("");
      setBannerImage(null);
    } catch (error) {
      console.error("Error creating podcast:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setBannerImage(e.target.files[0]);
    }
  };

  return (
    <div>
      <h2>Create Podcast</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        <button type="submit">Create Podcast</button>
      </form>
    </div>
  );
}
