// maze.draw.js

import {
  COLORS,
  CELL_SIZE,
  GAME_STATE,
  getGameState,
  getMaze,
  getPlayer,
  getGoal,
  getEnemies,
  getSparkles,
  getGoalParticles,
  setGoalParticles
} from "./maze.logic.js";

const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");
let frame = 0;

export function drawLoop() {
  function loop() {
    frame++;
    draw();
    requestAnimationFrame(loop);
  }
  loop();
}

function draw() {
  if (getGameState() === GAME_STATE.TITLE) {
    drawTitleScreen();
    return;
  }

  const maze = getMaze();
  const player = getPlayer();
  const goal = getGoal();
  const enemies = getEnemies();
  const sparkles = getSparkles();
  let goalParticles = getGoalParticles();

  const shake = Math.sin(frame * 0.05) * 0.5;

  ctx.save();
  ctx.translate(shake, shake);

  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMaze(maze);
  drawSparkles(sparkles);
  drawGoalParticles(goalParticles);
  drawGoal(goal);
  drawPlayer(player);
  enemies.forEach(drawEnemy);

  ctx.restore();
}

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

function drawMaze(maze) {
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

function drawPlayer(player) {
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

function drawGoal(goal) {
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

function drawSparkles(sparkles) {
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

function drawGoalParticles(goalParticles) {
  goalParticles.forEach(p => {
    ctx.fillStyle = "rgba(253, 230, 138, 0.8)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fill();

    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  });

  // 更新して反映
  setGoalParticles(goalParticles.filter(p => p.life > 0));
}

function drawTitleScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fff7ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#7c3aed";
  ctx.font = "bold 42px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✨ まじかる迷路 ✨", canvas.width / 2, canvas.height / 2 - 40);

  ctx.font = "20px sans-serif";
  ctx.fillStyle = "#6b7280";
  ctx.fillText("Press Space to Start", canvas.width / 2, canvas.height / 2 + 20);

  ctx.globalAlpha = 0.4 + Math.sin(frame * 0.05) * 0.2;
  ctx.fillStyle = "#facc15";
  ctx.beginPath();
  ctx.arc(canvas.width / 2 + Math.sin(frame * 0.1) * 60, canvas.height / 2 - 80, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  for (let i = 0; i < 20; i++) {
    const x = (i * 73 + frame * 0.7) % canvas.width;
    const y = (i * 47 + Math.sin(frame * 0.02 + i) * 30) % canvas.height;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}
