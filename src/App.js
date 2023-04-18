// App.js
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInSignUp from "./components/SignInSignUp";
import Profile from "./components/Profile";
import Podcasts from "./components/Podcasts";
import CreatePodcast from "./components/CreatePodcast";
import CreateEpisode from "./components/CreateEpisode";
import PodcastDetails from "./components/PodcastDetails";
import PrivateRoutes from "./components/PrivateRoutes";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "./slices/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: user.uid,
                })
              );
            }
          },
          (error) => {
            console.error("Error fetching user data:", error);
          }
        );

        return () => {
          unsubscribeSnapshot();
        };
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignInSignUp />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/create-podcast" element={<CreatePodcast />} />
            <Route path="/podcast/:podcastId" element={<PodcastDetails />} />
            <Route
              path="/podcast/:podcastId/create-episode"
              element={<CreateEpisode />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
