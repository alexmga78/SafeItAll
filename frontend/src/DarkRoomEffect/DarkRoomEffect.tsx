import React, { useState, ReactNode, useEffect, useRef } from "react";
import "./DarkRoomEffect.css";

interface DarkRoomEffectProps {
  children: ReactNode;
}

const DarkRoomEffect: React.FC<DarkRoomEffectProps> = ({ children }) => {
  const [mousePos, setMousePos] = useState({ x: "50%", y: "50%" });
  const containerRef = useRef<HTMLDivElement>(null);
  const flashlightRef = useRef<HTMLSpanElement>(null);
  const blurFilterRef = useRef<SVGFEGaussianBlurElement>(null);
  const lightRadius = 500;
  const filterIntensity = 100;

  useEffect(() => {
    if (blurFilterRef.current) {
      blurFilterRef.current.setAttribute(
        "stdDeviation",
        String(filterIntensity)
      );
    }
  }, [filterIntensity]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = `${e.clientX - rect.left}px`;
    const newY = `${e.clientY - rect.top}px`;

    setMousePos({ x: newX, y: newY });
    containerRef.current.style.setProperty("--cursorX", newX);
    containerRef.current.style.setProperty("--cursorY", newY);

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
      onMouseMove={handleMouseMove}
      style={{
        position: "absolute", // Absolute positioning so it doesn't affect other layout elements
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}>
      <div className="dark-overlay">
        <svg width="0" height="0">
          <defs>
            <filter id="blur-filter">
              <feGaussianBlur ref={blurFilterRef} />
            </filter>
          </defs>
        </svg>
        <span
          ref={flashlightRef}
          className="flashlight"
          style={{
            width: `${lightRadius}px`,
            height: `${lightRadius}px`,
            filter: `url(#blur-filter)`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1,
        }}>
        {children}
      </div>
    </div>
  );
};

export default DarkRoomEffect;
