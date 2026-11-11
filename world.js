(() => {
  const canvas = document.getElementById("world");
  const ctx = canvas.getContext("2d", { alpha: false });
  const W = canvas.width, H = canvas.height;
  const map = [
    "111111111111111","100000000000001","100000000000001",
    "100020000030001","100020000030001","100000000000001",
    "100000000000001","100040000000001","100040000000001",
    "100000000000001","111111111111111"
  ].map(row => row.split("").map(Number));
  let px = 7.5, py = 8.5, angle = -Math.PI / 2;
  let nearLab = false, dragging = false, lastX = 0;
  const keys = new Set();
  const objective = document.getElementById("objective");
  const hint = document.getElementById("interactHint");
  const actionButton = document.getElementById("actionButton");
  const colors = {
    2: ["#c0a77b", "#8d7655"],
    3: ["#a63c31", "#742d27"],
    4: ["#647d85", "#405b63"]
  };
  function wall(x, y) {
    return map[Math.floor(y)]?.[Math.floor(x)] ?? 1;
  }
  function cast(rayAngle) {
    const sin = Math.sin(rayAngle), cos = Math.cos(rayAngle);
    let distance = 0, hit = 0, side = 0;
    while (distance < 18) {
      distance += 0.035;
      const x = px + cos * distance, y = py + sin * distance;
      hit = wall(x, y);
      if (hit) {
        side = Math.abs((x - Math.floor(x)) - 0.5) > Math.abs((y - Math.floor(y)) - 0.5) ? 0 : 1;
        break;
      }
    }
    return { distance: Math.max(0.02, distance * Math.cos(rayAngle - angle)), hit, side };
  }
  function drawFloorGrid() {
    ctx.strokeStyle = "#d6d2b044";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 10; i++) {
      const y = H * 0.56 + i * i * 1.45;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }
  function draw() {
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.56);
    sky.addColorStop(0, "#7e9da3"); sky.addColorStop(1, "#c0c4ad");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H * 0.56);
    ctx.fillStyle = "#777c61"; ctx.fillRect(0, H * 0.56, W, H * 0.44);
    drawFloorGrid();
    for (let x = 0; x < W; x++) {
      const rayAngle = angle + (x / W - 0.5) * 1.12;
      const ray = cast(rayAngle);
      const height = Math.min(H * 1.5, H / (ray.distance * 0.78));
      const top = H * 0.54 - height / 2;
      const palette = ray.hit === 1 ? ["#687366", "#4e594c"] : (colors[ray.hit] || ["#66766c", "#4b5b50"]);
      ctx.fillStyle = ray.side ? palette[1] : palette[0];
      ctx.fillRect(x, top, 1, height);
      ctx.fillStyle = "#111"; ctx.globalAlpha = Math.min(0.55, ray.distance / 13);
      ctx.fillRect(x, top, 1, height); ctx.globalAlpha = 1;
    }
    const distanceToLab = Math.hypot(px - 7.5, py - 3.5);
    nearLab = distanceToLab < 2.3;
    hint.classList.toggle("show", nearLab);
    actionButton.disabled = !nearLab;
    if (distanceToLab < 3.2) {
      ctx.fillStyle = "#f0e6cf"; ctx.font = "bold 8px Arial"; ctx.textAlign = "center";
      ctx.fillText("CUSTOM LAB", W / 2, H * 0.36);
    }
    requestAnimationFrame(draw);
  }
  function move(dx, dy) {
    const nx = px + dx, ny = py + dy;
    if (!wall(nx + Math.sign(dx) * 0.18, py)) px = nx;
    if (!wall(px, ny + Math.sign(dy) * 0.18)) py = ny;
  }
  function tick() {
    const speed = 0.045;
    if (keys.has("w") || keys.has("arrowup")) move(Math.cos(angle) * speed, Math.sin(angle) * speed);
    if (keys.has("s") || keys.has("arrowdown")) move(-Math.cos(angle) * speed, -Math.sin(angle) * speed);
    if (keys.has("a") || keys.has("arrowleft")) move(Math.cos(angle - Math.PI / 2) * speed, Math.sin(angle - Math.PI / 2) * speed);
    if (keys.has("d") || keys.has("arrowright")) move(Math.cos(angle + Math.PI / 2) * speed, Math.sin(angle + Math.PI / 2) * speed);
    requestAnimationFrame(tick);
  }
  function openLab() {
    if (!nearLab) return;
    document.getElementById("labModal").hidden = false;
    objective.textContent = "CUSTOM LAB DIBUKA — RANCANG KAOSMU";
    actionButton.textContent = "LAB OPEN";
  }
  window.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();
    if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)) {
      event.preventDefault(); keys.add(key);
    }
    if (key === "e") openLab();
  });
  window.addEventListener("keyup", event => keys.delete(event.key.toLowerCase()));
  document.querySelectorAll("[data-move]").forEach(button => {
    const mapping = { forward: "w", back: "s", left: "a", right: "d" };
    const down = event => { event.preventDefault(); keys.add(mapping[button.dataset.move]); };
    const up = event => { event.preventDefault(); keys.clear(); };
    button.addEventListener("pointerdown", down);
    ["pointerup","pointercancel","pointerleave"].forEach(type => button.addEventListener(type, up));
  });
  canvas.addEventListener("pointerdown", event => { dragging = true; lastX = event.clientX; });
  window.addEventListener("pointerup", () => { dragging = false; });
  window.addEventListener("pointermove", event => {
    if (!dragging) return;
    angle += (event.clientX - lastX) * 0.006; lastX = event.clientX;
  });
  document.getElementById("helpButton").addEventListener("click", () => { document.getElementById("helpModal").hidden = false; });
  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => { document.getElementById(button.dataset.close).hidden = true; });
  });
  actionButton.addEventListener("click", openLab);
  document.getElementById("backToWorld").addEventListener("click", () => {
    document.getElementById("labModal").hidden = true;
    objective.textContent = "LANJUTKAN EKSPLORASI PLAZA";
    actionButton.textContent = "INTERACT ↗";
  });
  document.querySelectorAll(".swatches button").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".swatches button").forEach(item => item.classList.remove("selected"));
      button.classList.add("selected");
      document.getElementById("tee").style.background = button.dataset.color;
    });
  });
  document.getElementById("shirtText").addEventListener("input", event => {
    document.getElementById("teeText").textContent = event.target.value || "YOUR IDEA";
  });
  draw(); tick();
})();