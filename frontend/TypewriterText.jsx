import React, { useEffect, useState, useRef } from "react";

const TypewriterText = ({ text, duration }) => {
  const [displayText, setDisplayText] = useState("");
  const prevTextRef = useRef("");

  useEffect(() => {
    const prevText = prevTextRef.current;

    // Etsi yhteinen prefix, jotta vain muuttuva osa animoituu
    let commonPrefixLength = 0;
    while (
      commonPrefixLength < prevText.length &&
      commonPrefixLength < text.length &&
      prevText[commonPrefixLength] === text[commonPrefixLength]
    ) {
      commonPrefixLength++;
    }

    const newTextPart = text.slice(commonPrefixLength);
    if (newTextPart.length === 0) return;

    // Jos durationia ei annettu, käytä oletuksena 0.7s
    const finalDuration = duration ?? 700; 
    const speed = finalDuration / newTextPart.length;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(text.slice(0, commonPrefixLength + i + 1));
      i++;
      if (i >= newTextPart.length) clearInterval(interval);
    }, speed);

    prevTextRef.current = text;
    return () => clearInterval(interval);
  }, [text, duration]);

  return <span>{displayText}</span>;
};

export default TypewriterText;
