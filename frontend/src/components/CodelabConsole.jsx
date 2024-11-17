import React, { useState, useEffect, useCallback } from "react";

const CodelabConsole = () => {
  const words = [
    "Real-Time Collaboration",
    "Multilingual Code Support",
    "Interactive Whiteboard",
    "CodeLab",
    "Instant Code Execution",
    "Live Problem Solving",
  ];
  const colors = [
    "#FF6347",
    "#8A2BE2",
    "#00BFFF",
    "#32CD32",
    "#FFD700",
    "#FF4500",
  ];

  const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isUnderscoreVisible, setIsUnderscoreVisible] = useState(true);

  const currentWord = words[wordIndex];
  const currentColor = colors[wordIndex];

  const handleLetterIndexChange = useCallback(() => {
    if (letterIndex === currentWord.length && direction === 1) {
      setDirection(-1);
    } else if (letterIndex === 0 && direction === -1) {
      setDirection(1);
      setWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    } else {
      setLetterIndex((prevIndex) => prevIndex + direction);
    }
  }, [currentWord, direction, wordIndex, words]);

  useEffect(() => {
    const intervalId = setInterval(handleLetterIndexChange, 120);
    return () => clearInterval(intervalId);
  }, [handleLetterIndexChange]);

  useEffect(() => {
    const underscoreIntervalId = setInterval(() => {
      setIsUnderscoreVisible((prev) => !prev);
    }, 400);
    return () => clearInterval(underscoreIntervalId);
  }, []);

  return (
    <div className="console-container-main-title">
      <span className="console-container__text" style={{ color: currentColor }}>
        {currentWord.substring(0, letterIndex)}
      </span>
      <span
        className={`console-container__underscore ${
          isUnderscoreVisible ? "" : "hidden"
        }`}
      >
        _
      </span>
    </div>
  );
};

export default CodelabConsole;
