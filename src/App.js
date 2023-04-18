// App.js
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignInSignUp from "./components/SignInSignUp";
import Profile from "./components/Profile";
import Podcasts from "./components/Podcasts";
import CreatePodcast from "./components/CreatePodcast";
import CreateEpisode from "./components/CreateEpisode";
import PodcastDetails from "./components/PodcastDetails";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<SignInSignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/podcasts" element={<Podcasts />} />
          <Route path="/create-podcast" element={<CreatePodcast />} />
          <Route
            path="/podcast/:podcastId/create-episode"
            element={<CreateEpisode />}
          />
          <Route path="/podcast/:podcastId" element={<PodcastDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
