// maze.logic.js
export const COLORS = {
  wall: "#c4b5fd",
  floor: "#fffaf0",
  player: "#6ee7b7",
  enemy: "#fda4af",
  goal: "#fde68a",
};

export const CELL_SIZE = 20;
export const MAZE_WIDTH = 21;
export const MAZE_HEIGHT = 21;

export const GAME_STATE = {
  TITLE: "title",
  PLAYING: "playing",
  CLEAR: "clear",
};

let maze = [];
let player = { x: 1, y: 1 };
let goal = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };
let enemies = [];
let sparkles = [];
let goalParticles = [];
let gameState = GAME_STATE.TITLE;

export function getGameState() {
  return gameState;
}
export function setGameState(state) {
  gameState = state;
}

export function getMaze() { return maze; }
export function getPlayer() { return player; }
export function getGoal() { return goal; }
export function getEnemies() { return enemies; }
export function getSparkles() { return sparkles; }
export function getGoalParticles() { return goalParticles; }
export function setGoalParticles(arr) { goalParticles = arr; }

export function generateMaze(width, height) {
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 1)
  );

  const stack = [];
  let x = 1, y = 1;
  maze[y][x] = 0;
  stack.push([x, y]);

  const dirs = [[0,-2],[0,2],[-2,0],[2,0]];

  while (stack.length) {
    const [cx, cy] = stack[stack.length - 1];
    let moved = false;

    dirs.sort(() => Math.random() - 0.5);

    for (const [dx, dy] of dirs) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx > 0 && nx < width-1 && ny > 0 && ny < height-1) {
        if (maze[ny][nx] === 1) {
          maze[ny][nx] = 0;
          maze[cy + dy/2][cx + dx/2] = 0;
          stack.push([nx, ny]);
          moved = true;
          break;
        }
      }
    }
    if (!moved) stack.pop();
  }
  return maze;
}

export function initGame() {
  const canvas = document.getElementById("mazeCanvas");
  canvas.width = MAZE_WIDTH * CELL_SIZE;
  canvas.height = MAZE_HEIGHT * CELL_SIZE;

  maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);

  player = { x: 1, y: 1 };
  goal = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };

  enemies = [];
  for (let i = 0; i < 2; i++) enemies.push(placeEnemy());

  sparkles = [];
  for (let i = 0; i < 60; i++) sparkles.push(createSparkle());

  goalParticles = [];
}

export function randomDir() {
  const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
  return dirs[Math.floor(Math.random() * dirs.length)];
}

export function isFloor(x, y) {
  return maze[y] && maze[y][x] === 0;
}

export function placeEnemy() {
  let x, y;
  do {
    x = Math.floor(Math.random() * MAZE_WIDTH);
    y = Math.floor(Math.random() * MAZE_HEIGHT);
  } while (!isFloor(x, y) || (x === 1 && y === 1));
  return { x, y, dir: randomDir() };
}

export function moveEnemies() {
  enemies.forEach(enemy => {
    const [dx, dy] = enemy.dir;
    const nx = enemy.x + dx;
    const ny = enemy.y + dy;

    if (maze[ny][nx] === 1) {
      enemy.dir = randomDir();
    } else {
      enemy.x = nx;
      enemy.y = ny;
    }

    if (enemy.x === player.x && enemy.y === player.y) {
      player.x = 1;
      player.y = 1;
      alert("敵に当たった！");
    }
  });
}

export function createSparkle() {
  const canvas = document.getElementById("mazeCanvas");
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    alpha: Math.random() * 0.5 + 0.3,
    speed: Math.random() * 0.3 + 0.1,
  };
}

// ここが重要：プレイヤー移動関数
export function movePlayer(dx, dy) {
  if (gameState !== GAME_STATE.PLAYING) return;

  const nx = player.x + dx;
  const ny = player.y + dy;

  if (isFloor(nx, ny)) {
    player.x = nx;
    player.y = ny;
  }

  // ゴール判定
  if (player.x === goal.x && player.y === goal.y) {
    gameState = GAME_STATE.CLEAR;
  }
}
