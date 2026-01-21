// maze.main.js
import { initGame, moveEnemies, getGameState, GAME_STATE, movePlayer, setGameState } from "./maze.logic.js";
import { drawLoop } from "./maze.draw.js";
import { setupTitle } from "./maze.title.js";

setupTitle();
drawLoop();

// 敵の移動
setInterval(() => {
  if (getGameState() === GAME_STATE.PLAYING) {
    moveEnemies();
  }
}, 250);

// 矢印キーで移動
window.addEventListener("keydown", (e) => {
  if (getGameState() !== GAME_STATE.PLAYING) return;

  if (e.key === "ArrowUp") movePlayer(0, -1);
  if (e.key === "ArrowDown") movePlayer(0, 1);
  if (e.key === "ArrowLeft") movePlayer(-1, 0);
  if (e.key === "ArrowRight") movePlayer(1, 0);
});

// リセットボタン（ここで一回だけ登録）
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
  initGame();
  setGameState(GAME_STATE.PLAYING);
});
