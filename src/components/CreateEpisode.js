// components/CreateEpisode.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function CreateEpisode() {
  const { podcastId } = useParams();
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      try {
        const podcastDoc = await getDoc(doc(db, "podcasts", podcastId));
        if (podcastDoc.exists()) {
          setPodcast({ id: podcastDoc.id, ...podcastDoc.data() });
        }
      } catch (error) {
        console.error("Error fetching podcast:", error);
      }
    };

    fetchPodcast();
  }, [podcastId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const audioRef = ref(
        storage,
        `podcast-episodes/${auth.currentUser.uid}/${Date.now()}`
      );
      await uploadBytes(audioRef, audioFile);

      const audioURL = await getDownloadURL(audioRef);
      const episodeData = {
        title,
        description,
        audioFile: audioURL,
      };

      await addDoc(
        collection(db, "podcasts", podcastId, "episodes"),
        episodeData
      );
      alert("Episode created successfully!");

      setTitle("");
      setDescription("");
      setAudioFile(null);
    } catch (error) {
      console.error("Error creating episode:", error);
    }
  };

  const handleAudioChange = (e) => {
    if (e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  if (!podcast) {
    return <div>Loading...</div>;
  }

  if (auth.currentUser.uid !== podcast.createdBy) {
    return (
      <div>You do not have permission to create episodes for this podcast.</div>
    );
  }

  return (
    <div>
      <h2>Create Episode for {podcast.title}</h2>
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
          accept="audio/*"
          onChange={handleAudioChange}
          required
        />
        <button type="submit">Create Episode</button>
      </form>
    </div>
  );
}

export default CreateEpisode;
