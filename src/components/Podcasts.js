// components/Podcasts.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setPodcasts } from "../slices/podcastSlice";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

function Podcasts() {
  const podcasts = useSelector((state) => state.podcast.podcasts);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "podcasts")),
      (querySnapshot) => {
        const podcastsData = [];
        querySnapshot.forEach((doc) => {
          podcastsData.push({ id: doc.id, ...doc.data() });
        });
        dispatch(setPodcasts(podcastsData));
      },
      (error) => {
        console.error("Error fetching podcasts:", error);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <div>
      <h2>All Podcasts</h2>
      <ul>
        {podcasts.map((podcast) => (
          <li key={podcast.id}>
            <Link to={`/podcast/${podcast.id}`}>
              <h3>{podcast.title}</h3>
            </Link>
            <img src={podcast.bannerImage} width="500" />
            <p>{podcast.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Podcasts;
