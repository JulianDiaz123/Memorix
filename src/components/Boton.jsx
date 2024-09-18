import React from "react";
import "./Boton.css";

export function Boton({ Color, onClick, className, disabled }) {
  return (
    <button
      style={{ backgroundColor: Color }}
      className={`boton ${className}`}
      onClick={onClick}
      disabled={disabled}
    ></button>
  );
}
