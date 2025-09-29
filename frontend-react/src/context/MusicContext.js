import React, { createContext, useState, useEffect } from "react";
import musicFile from "../music/Semo.mp3"; // Ensure the path is correct

export const MusicContext = createContext();

const audio = new Audio(musicFile);
audio.loop = true;

export const MusicProvider = ({ children }) => {
  const [isMusicOn, setIsMusicOn] = useState(
    localStorage.getItem("isMusicOn") === "true"
  );

  useEffect(() => {
    if (isMusicOn) {
      audio.play().catch((error) => console.log("Audio play error:", error));
    } else {
      audio.pause();
    }
    localStorage.setItem("isMusicOn", isMusicOn);
  }, [isMusicOn]);

  return (
    <MusicContext.Provider value={{ isMusicOn, setIsMusicOn }}>
      {children}
    </MusicContext.Provider>
  );
};
