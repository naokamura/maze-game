// ==============================
// 🎨 カラー設定
// ==============================
const COLORS = {
  wall: "#c4b5fd",   
  floor: "#fffaf0",  
  player: "#6ee7b7",
  enemy: "#fda4af",
  goal: "#fde68a",
};

// ==============================
// 🧱 共通設定
// ==============================
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

const CELL_SIZE = 20;
const MAZE_WIDTH = 21;
const MAZE_HEIGHT = 21;

let maze;
let player;
let goal;
let enemies = [];
let frame = 0;
let sparkles = [];
let goalParticles = [];



// ==============================
// 🟪 角丸矩形
// ==============================
function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
}

// ==============================
// 🌀 迷路生成
// ==============================
function generateMaze(width, height) {
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

// ==============================
// 🕹 初期化
// ==============================
function initGame() {
  canvas.width = MAZE_WIDTH * CELL_SIZE;
  canvas.height = MAZE_HEIGHT * CELL_SIZE;

  maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);

  player = { x: 1, y: 1 };
  goal = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };

  enemies = [];
  for (let i = 0; i < 2; i++) enemies.push(placeEnemy());

  sparkles = [];
  for (let i = 0; i < 60; i++) {
  sparkles.push(createSparkle());}
}

// ==============================
// 👾 敵関連
// ==============================
function randomDir() {
  const dirs = [[0,-1],[0,1],[-1,0],[1,0]];
  return dirs[Math.floor(Math.random() * dirs.length)];
}

function isFloor(x, y) {
  return maze[y] && maze[y][x] === 0;
}

function placeEnemy() {
  let x, y;
  do {
    x = Math.floor(Math.random() * MAZE_WIDTH);
    y = Math.floor(Math.random() * MAZE_HEIGHT);
  } while (!isFloor(x, y) || (x === 1 && y === 1));
  return { x, y, dir: randomDir() };
}

function moveEnemies() {
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

// ==============================
// 🎨 描画
// ==============================
function drawMaze() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      ctx.fillStyle = maze[y][x] === 1 ? COLORS.wall : COLORS.floor;
      drawRoundRect(
        ctx,
        x * CELL_SIZE + 1,
        y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2,
        6
      );
    }
  }
}

function drawPlayer() {
  const cx = player.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = player.y * CELL_SIZE + CELL_SIZE / 2;
  const scale = 1 + Math.sin(frame * 0.2) * 0.05;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = COLORS.player;
  ctx.beginPath();
  ctx.arc(0, 0, CELL_SIZE / 2.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawEnemy(enemy, index) {
  const cx = enemy.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = enemy.y * CELL_SIZE + CELL_SIZE / 2;
  const wobble = Math.sin(frame * 0.15 + index) * 1.5;

  ctx.save();
  ctx.translate(cx, cy + wobble);

  ctx.fillStyle = COLORS.enemy;
  ctx.beginPath();
  ctx.arc(0, 0, CELL_SIZE / 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}


function draw() {
  const shake = Math.sin(frame * 0.05) * 0.5;

  ctx.save();
  ctx.translate(shake, shake);

  // ふんわり残像エフェクト
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMaze();
  drawSparkles();
  drawGoalParticles();
  drawGoal();
  drawPlayer();
  enemies.forEach(drawEnemy);

  ctx.restore();
}


function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

function drawGoal() {
  const cx = goal.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = goal.y * CELL_SIZE + CELL_SIZE / 2;

  const pulse = 1 + Math.sin(frame * 0.15) * 0.15;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(pulse, pulse);

  ctx.shadowColor = COLORS.goal;
  ctx.shadowBlur = 15;

  ctx.fillStyle = COLORS.goal;
  drawStar(0, 0, 5, CELL_SIZE / 2.2, CELL_SIZE / 4);

  ctx.restore();
}

function createSparkle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    alpha: Math.random() * 0.5 + 0.3,
    speed: Math.random() * 0.3 + 0.1,
  };
}

function drawSparkles() {
  sparkles.forEach(s => {
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();

    s.y -= s.speed;
    if (s.y < 0) {
      s.y = canvas.height;
      s.x = Math.random() * canvas.width;
    }
  });
}

function explodeGoal() {
  const cx = goal.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = goal.y * CELL_SIZE + CELL_SIZE / 2;

  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;

    goalParticles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 40,
    });
  }
}

function drawGoalParticles() {
  goalParticles.forEach(p => {
    ctx.fillStyle = "rgba(253, 230, 138, 0.8)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  });

  goalParticles = goalParticles.filter(p => p.life > 0);
}


// ==============================
// 🎮 操作
// ==============================
window.addEventListener("keydown", e => {
  let nx = player.x;
  let ny = player.y;

  if (e.key === "ArrowUp") ny--;
  if (e.key === "ArrowDown") ny++;
  if (e.key === "ArrowLeft") nx--;
  if (e.key === "ArrowRight") nx++;

  if (maze[ny][nx] === 0) {
    player.x = nx;
    player.y = ny;
  }

  if (player.x === goal.x && player.y === goal.y) {
  explodeGoal();
  setTimeout(() => {
    alert("クリア！🎉");
    initGame();
  }, 300);
}

});

// ==============================
// 🔁 ループ
// ==============================
setInterval(moveEnemies, 250);

function gameLoop() {
  frame++;
  draw();
  requestAnimationFrame(gameLoop);
}

// ==============================
// 🚀 開始
// ==============================
document.getElementById("resetBtn").addEventListener("click", initGame);

initGame();
gameLoop();
