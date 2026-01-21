// maze.title.js
import { initGame, setGameState, GAME_STATE } from "./maze.logic.js";

export function setupTitle() {
  const titleScreen = document.getElementById("titleScreen");
  const startBtn = document.getElementById("startBtn");
  const canvas = document.getElementById("mazeCanvas");
  const resetBtn = document.getElementById("resetBtn");

  canvas.style.display = "none";
  resetBtn.style.display = "none";

  startBtn.addEventListener("click", () => {
    initGame();
    setGameState(GAME_STATE.PLAYING);

    titleScreen.style.display = "none";
    canvas.style.display = "block";
    resetBtn.style.display = "block";
  });
}
