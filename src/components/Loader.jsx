import React from "react";

const Loader = ({ size = 8, color = "#ff5733", text = "" }) => {
  const spinnerStyle = {
    position: "relative",
    width: `${size}px`,
    height: `${size}px`,
    display: "inline-block",
  };

  const dotStyle = (i) => ({
    position: "absolute",
    width: "50%",
    height: "150%",
    background: color,
    transform: `rotate(${(i + 1) * 36}deg) translate(0, 150%)`,
    transformOrigin: "bottom center",
    animation: `spinnerAnim 1s ${(i + 1) * 0.1}s infinite ease`,
  });

  const keyframes = `
    @keyframes spinnerAnim {
      0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
        transform: rotate(var(--rotation, 0deg)) translate(0, var(--translate, 150%));
      }
      50% {
        transform: rotate(var(--rotation, 0deg)) translate(0, var(--translateGrow, 225%));
      }
    }
  `;

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <style>{keyframes}</style>
      <span style={spinnerStyle}>
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <span
              key={i}
              style={{
                ...dotStyle(i),
                "--rotation": `${(i + 1) * 36}deg`,
                "--translate": "150%",
                "--translateGrow": "225%",
              }}
            ></span>
          ))}
      </span>
    </span>
  );
};

export default Loader;
