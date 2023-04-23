// components/CreatePodcast.js
import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import InputComponent from "../components/Input";
import FileInput from "../components/Input/FileInput";
import Button from "../components/Button";
import { toast } from "react-toastify";

export default function CreatePodcast() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
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
      toast.success("Podcast Created Successful!");
    } catch (error) {
      console.error("Error creating podcast:", error);
      toast.error("Error creating podcast:", error);
    }
  };

  const handleImageChange = (file) => {
    setBannerImage(file);
  };

  return (
    <div>
      <Header />
      <h2>Create Podcast</h2>
      <form>
        <InputComponent
          type="text"
          placeholder="Title"
          state={title}
          setState={setTitle}
        />
        <InputComponent
          type="text"
          placeholder="Description"
          state={description}
          setState={setDescription}
        />

        <FileInput onFileSelected={handleImageChange} accept={".mp3"} />
        <Button text="Create Podcast" onClick={handleSubmit} />
      </form>
    </div>
  );
}
