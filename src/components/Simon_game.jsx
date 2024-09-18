import React, { useState, useEffect, useRef } from "react";
import "./Simon_game.css";
import { Boton } from "./Boton";

const colors = ["#600", "#660", "#006", "#060"];
const totalRounds = 5;

//Estados del componente
export function SimonGame() {
  const [round, setRound] = useState(1);
  const [userPosition, setUserPosition] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [blockedButtons, setBlockedButtons] = useState(true);
  const [speed, setSpeed] = useState(1000);
  const [highlightedColor, setHighlightedColor] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  //Referencia a los sonidos
  const buttonSounds = useRef([]);
  const errorSound = useRef(null);
  const startSound = useRef(null);
  const wonSound = useRef(null);

  //Inicializa los sonidos cuando el componente se monta
  useEffect(() => {
    buttonSounds.current = [
      new Audio("/sounds/s1.mp3"),
      new Audio("/sounds/s2.mp3"),
      new Audio("/sounds/s3.mp3"),
      new Audio("/sounds/s4.mp3"),
    ];
    errorSound.current = new Audio("/sounds/error.wav");
    startSound.current = new Audio("/sounds/start.mp3");
    wonSound.current = new Audio("/sounds/won.mp3");
  }, []);

  //Muestrar la secuencia o bloquea los botones según el estado del juego
  useEffect(() => {
    if (gameOver || gameWon) {
      setBlockedButtons(true);
    } else if (sequence.length > 0) {
      showSequence();
    }
  }, [sequence, gameOver, gameWon]);

  //Inicia el juego
  const startGame = () => {
    startSound.current.play(); //Reproduce el sonido del boton de inicio
    setRound(1);
    setUserPosition(0);
    setPlayerSequence([]);
    setSequence([Math.floor(Math.random() * colors.length)]); //Inicia una secuencia aleatoria
    setSpeed(1000);
    setGameOver(false);
    setGameWon(false);
    setBlockedButtons(true); //Bloquea los botones al inicio
  };
  //Reproduce un sonido
  const playSound = (audio) => {
    if (audio.currentTime > 0 && !audio.paused) {
      audio.currentTime = 0;
      audio.pause();
    }
    audio.play().catch((e) => console.error("Error playing sound", e));
  };

  //Maneja el click de un boton
  const handleButtonClick = (index) => {
    if (!blockedButtons) {
      playSound(buttonSounds.current[index]); //Reproduce el sonido del boton
      validateColor(index); //Valida el color seleccionado
    }
  };
  //Valida el color seleccionado
  const validateColor = (index) => {
    if (sequence[userPosition] === index) {
      const newPlayerSequence = [...playerSequence, index];
      setPlayerSequence(newPlayerSequence);

      if (newPlayerSequence.length === sequence.length) {
        if (sequence.length === totalRounds) {
          wonSound.current.play();
          setGameWon(true);
          return;
        }

        // Agrega un nuevo color a la secuencia y avanza a la siguiente ronda
        setSequence((prevSequence) => [
          ...prevSequence,
          Math.floor(Math.random() * colors.length),
        ]);
        setRound((prevRound) => prevRound + 1);
        setSpeed((prevSpeed) => prevSpeed / 1.02); // Aumenta la velocidad
        setUserPosition(0);
        setPlayerSequence([]);
      } else {
        setUserPosition((prevPosition) => prevPosition + 1); // Avanza a la siguiente posición en la secuencia
      }
    } else {
      gameLost();
    }
  };

  // Maneja la pérdida del juego
  const gameLost = () => {
    errorSound.current.play();
    setGameOver(true);
  };

  // Muestra la secuencia de colores
  const showSequence = () => {
    setBlockedButtons(true); // Bloquea los botones mientras se muestra la secuencia
    let sequenceIndex = 0;
    const timer = setInterval(() => {
      const colorIndex = sequence[sequenceIndex];
      setHighlightedColor(colorIndex);
      playSound(buttonSounds.current[colorIndex]); // Reproduce el sonido del color
      setTimeout(() => setHighlightedColor(null), speed / 3); // Desactiva el boton resaltado después de un tiempo
      sequenceIndex++;
      if (sequenceIndex >= round) {
        clearInterval(timer); // Detiene el temporizador cuando se muestra toda la secuencia
        setBlockedButtons(false); // Desbloquea los botones
      }
    }, speed);
  };

  return (
    <>
      <h2 className="round">Ronda: {round}</h2>
      <span>{blockedButtons ? "Espera" : "Tu turno"}</span>
      <div
        className={`simon ${gameWon ? "won" : "" || gameOver ? "lost" : ""}`}
      >
        {colors.map((color, index) => (
          <Boton
            key={index}
            Color={color}
            onClick={() => handleButtonClick(index)}
            className={
              blockedButtons && highlightedColor !== index
                ? "blocked"
                : highlightedColor === index
                ? "active"
                : ""
            }
            disabled={blockedButtons}
          />
        ))}
        <button className="btn-inicio" onClick={startGame}>
          {gameOver || gameWon ? "Reset" : "Start"}
        </button>
        {gameWon ? <div className="winner-message">🏆 Ganaste! 🏆</div> : ""}
        {gameOver ? <div className="loser-message">🤦‍♂️ Perdiste 🤦‍♂️.</div> : ""}
      </div>
    </>
  );
}
