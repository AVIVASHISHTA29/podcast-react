// components/PodcastDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, query, onSnapshot } from "firebase/firestore";
import AudioPlayer from "../components/AudioPlayer";
import Header from "../components/Header";

function PodcastDetails() {
  const { podcastId } = useParams();
  const [podcast, setPodcast] = useState(null);
  const [episodes, setEpisodes] = useState([]);

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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts", podcastId, "episodes")),
      (querySnapshot) => {
        const episodesData = [];
        querySnapshot.forEach((doc) => {
          episodesData.push({ id: doc.id, ...doc.data() });
        });
        setEpisodes(episodesData);
      },
      (error) => {
        console.error("Error fetching episodes:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [podcastId]);

  if (!podcast) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <h2>{podcast.title}</h2>
      <img src={podcast.bannerImage} alt={podcast.title} width="300" />
      <p>{podcast.description}</p>
      <h3>Episodes:</h3>
      <ul>
        {episodes.map((episode) => (
          <li key={episode.id}>
            <h4>{episode.title}</h4>
            <p>{episode.description}</p>
            <AudioPlayer audioSrc={episode.audioFile} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PodcastDetails;
