import React, { useState, ReactNode, useEffect, useRef } from "react";
import "./DarkRoomEffect.css";

interface DarkRoomEffectProps {
  children: ReactNode;
}

const DarkRoomEffect: React.FC<DarkRoomEffectProps> = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });
  const containerRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLSpanElement>(null);
  const lightRadius = 500;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = `${e.clientX - rect.left}px`;
    const newY = `${e.clientY - rect.top}px`;

    setMousePos({ x: newX, y: newY });

    if (flashlightRef.current) {
      flashlightRef.current.style.left = `${
        e.clientX - rect.left - lightRadius / 2
      }px`;
      flashlightRef.current.style.top = `${
        e.clientY - rect.top - lightRadius / 2
      }px`;
    }
  };

  return (
    <div
      ref={containerRef}
      className="dark-room-container"
      onMouseMove={handleMouseMove}>
      
      {/* Dark overlay that hides everything */}
      <div className="dark-overlay">
        <span
          ref={flashlightRef}
          className="flashlight"
          style={{
            width: `${lightRadius}px`,
            height: `${lightRadius}px`,
          }}
        />
      </div>

      {/* Children inside the dark effect */}
      <div className="dark-content">{children}</div>
    </div>
  );
};

export default DarkRoomEffect;
