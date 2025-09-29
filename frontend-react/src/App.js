import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { MusicProvider } from "./context/MusicContext";
import HomePage from "./components/HomePage";
import PlayPage from "./components/PlayPage";
import LevelSelectionPage from "./components/LevelSelectionPage";
import ScoreboardPage from "./components/ScoreboardPage";
import GamePage from "./components/GamePage";
import Settings from "./components/Settings";
import PrivateRoute from "./components/PrivateRoute";
import ProfileIcon from './components/ProfileIcon';

// Layout wrapper to show ProfileIcon on all pages except "/"
function AppLayout({ children }) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && <ProfileIcon />}
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/play" element={<PlayPage />} />
          <Route path="/level" element={<LevelSelectionPage />} />
          <Route path="/scoreboard" element={<ScoreboardPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <MusicProvider>
      <Router>
        <AppRoutes />
      </Router>
    </MusicProvider>
  );
}

export default App;
