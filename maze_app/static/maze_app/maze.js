const canvas = document.getElementById("mazeCanvas");
    const ctx = canvas.getContext("2d");

    const CELL_SIZE = 20;
    const MAZE_WIDTH = 21;
    const MAZE_HEIGHT = 21;

    let maze;
    let player;
    let goal;
    let enemy;
    let frame = 0;

    function generateMaze(width, height) {
      let maze = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => 1)
      );

      const stack = [];
      let x = 1, y = 1;
      maze[y][x] = 0;
      stack.push([x, y]);

      const directions = [
        [0, -2],
        [0, 2],
        [-2, 0],
        [2, 0],
      ];

      while (stack.length > 0) {
        const [cx, cy] = stack[stack.length - 1];
        let moved = false;

        directions.sort(() => Math.random() - 0.5);

        for (const [dx, dy] of directions) {
          const nx = cx + dx;
          const ny = cy + dy;

          if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1) {
            if (maze[ny][nx] === 1) {
              maze[ny][nx] = 0;
              maze[cy + dy / 2][cx + dx / 2] = 0;
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

    function initGame() {
      canvas.width = MAZE_WIDTH * CELL_SIZE;
      canvas.height = MAZE_HEIGHT * CELL_SIZE;

      maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);

      player = { x: 1, y: 1 };
      goal = { x: MAZE_WIDTH - 2, y: MAZE_HEIGHT - 2 };

      // 敵の初期位置（プレイヤーとゴール以外の場所にランダム）
      enemy = spawnEnemy();

      draw();
    }

    function spawnEnemy() {
      while (true) {
        const x = Math.floor(Math.random() * (MAZE_WIDTH - 2)) + 1;
        const y = Math.floor(Math.random() * (MAZE_HEIGHT - 2)) + 1;
        if (maze[y][x] === 0 && !(x === player.x && y === player.y) && !(x === goal.x && y === goal.y)) {
          return { x, y, dir: randomDir() };
        }
      }
    }

    function randomDir() {
      const dirs = [
        [0, -1],
        [0, 1],
        [-1, 0],
        [1, 0],
      ];
      return dirs[Math.floor(Math.random() * dirs.length)];
    }

    function moveEnemy() {
      const [dx, dy] = enemy.dir;
      const nx = enemy.x + dx;
      const ny = enemy.y + dy;

      // 壁にぶつかったら方向を変える
      if (maze[ny][nx] === 1) {
        enemy.dir = randomDir();
      } else {
        enemy.x = nx;
        enemy.y = ny;
      }

      // プレイヤーに当たったらスタートに戻る
      if (enemy.x === player.x && enemy.y === player.y) {
        player.x = 1;
        player.y = 1;
        alert("敵に当たった！スタートに戻ります");
      }
    }

    function drawMaze() {
      for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
          ctx.fillStyle = maze[y][x] === 1 ? "#b197fc" : "#f8f9ff";
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    

    function drawPlayer() {
    frame++;

    const cx = player.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = player.y * CELL_SIZE + CELL_SIZE / 2;

  // ぷるぷる（sin波）
    const scale = 1 + Math.sin(frame * 0.2) * 0.05;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

  // 体（グラデーション）
    const grad = ctx.createRadialGradient(0, -4, 4, 0, 0, CELL_SIZE / 2);
    grad.addColorStop(0, "#a5d8ff");
    grad.addColorStop(1, "#4dabf7");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, CELL_SIZE / 2.4, 0, Math.PI * 2);
    ctx.fill();

  // 目
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(-4, -2, 2, 0, Math.PI * 2);
    ctx.arc(4, -2, 2, 0, Math.PI * 2);
    ctx.fill();

  // 口
    ctx.strokeStyle = "#222";
    ctx.beginPath();
    ctx.arc(0, 3, 4, 0, Math.PI);
    ctx.stroke();

    ctx.restore();
    }


    function drawGoal() {
        frame++;

    const x = goal.x * CELL_SIZE;
    const y = goal.y * CELL_SIZE;

    const glow = Math.sin(frame * 0.2) * 5;

    ctx.fillStyle = "#ffd43b";
    ctx.fillRect(x + 6, y + 6, CELL_SIZE - 12, CELL_SIZE - 12);

    ctx.strokeStyle = `rgba(255, 215, 0, 0.7)`;
    ctx.lineWidth = 2 + glow * 0.1;
    ctx.strokeRect(x + 6, y + 6, CELL_SIZE - 12, CELL_SIZE - 12);
    }


    function drawEnemy() {
    frame++;

    const cx = enemy.x * CELL_SIZE + CELL_SIZE / 2;
    const cy = enemy.y * CELL_SIZE + CELL_SIZE / 2;

    const squash = 1 + Math.sin(frame * 0.3) * 0.1;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1.1, squash);

    ctx.fillStyle = "#ff8787";
    ctx.beginPath();
    ctx.arc(0, 0, CELL_SIZE / 2.5, 0, Math.PI * 2);
    ctx.fill();

  // 目
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(-4, -2, 3, 0, Math.PI * 2);
    ctx.arc(4, -2, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(-4, -2, 1.5, 0, Math.PI * 2);
    ctx.arc(4, -2, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    }




    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMaze();
      drawGoal();
      drawPlayer();
      drawEnemy();
    }

    window.addEventListener("keydown", (e) => {
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
        alert("クリア！🎉");
      }

      draw();
    });

    // 敵を定期的に動かす
    setInterval(() => {
      moveEnemy();
    }, 200);

    document.getElementById("resetBtn").addEventListener("click", initGame);

    initGame();
    // ↓ いちばん最後に追加
    function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
    }

    gameLoop();
