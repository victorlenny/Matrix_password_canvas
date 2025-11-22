// ==== Configuration ====
const SPECIAL_CHARS = "!@#$%^&*()-_=+[]{};:,.<>/?|~";
const ANIMATION_DURATION_MS = 650;
const TICK_INTERVAL_MS = 40;
const MAX_SAFE_CELLS = 200_000;

// ==== Pool Builder ====
function buildPool(opts) {
  let pool = "";
  if (opts.letters) {
    let uc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lc = "abcdefghijklmnopqrstuvwxyz";
    if (opts.uppercase) pool += uc;
    if (opts.lowercase) pool += lc;
    if (!opts.uppercase && !opts.lowercase) pool += uc + lc; // fallback
  }
  if (opts.numbers) pool += "0123456789";
  if (opts.specials) pool += SPECIAL_CHARS;
  return pool;
}

// ==== Cell Size Helper ====
function computeCellSize(cols) {
  if (cols <= 20) return 36;
  if (cols <= 30) return 30;
  if (cols <= 45) return 26;
  if (cols <= 60) return 22;
  if (cols <= 80) return 18;
  if (cols <= 100) return 16;
  return 14;
}

// ==== Grid Construction ====
function createGrid(rows, cols, container) {
  container.style.setProperty("--cell-size", computeCellSize(cols) + "px");
  container.style.gridTemplateColumns = `repeat(${cols}, var(--cell-size))`;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = "•"; // placeholder
      cell.dataset.row = r;
      cell.dataset.col = c;
      cells.push(cell);
      container.appendChild(cell);
    }
  }
  return cells;
}

// ==== Generation (final) ====
function finalizeGrid(rows, cols, pool, cells) {
  const pLen = pool.length;
  const lines = Array(rows).fill("").map(() => "");
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      const ch = pool[Math.floor(Math.random() * pLen)];
      cells[idx].textContent = ch;
      line += ch;
      idx++;
    }
    lines[r] = line;
  }
  return lines.join("\n");
}

// ==== Animation Scramble ====
function animateGrid(rows, cols, pool, cells, doneCallback) {
  const pLen = pool.length;
  let start = performance.now();
  let lastTick = 0;

  function tick(now) {
    if (now - lastTick >= TICK_INTERVAL_MS) {
      // scramble frame
      for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = pool[Math.floor(Math.random() * pLen)];
      }
      lastTick = now;
    }
    if (now - start >= ANIMATION_DURATION_MS) {
      const finalMatrix = finalizeGrid(rows, cols, pool, cells);
      doneCallback(finalMatrix);
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ==== Matrix Block Creation ====
function createMatrixBlock(rows, cols, pool, matrixText, index) {
  const wrapper = document.createElement("article");
  wrapper.className = "matrix-wrapper";
  wrapper.dataset.matrix = matrixText;

  const header = document.createElement("div");
  header.className = "matrix-header";

  const title = document.createElement("h2");
  title.className = "matrix-title";
  title.innerHTML = `Matrix <span class="badge">#${index + 1}</span>`;

  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "Copy";

  copyBtn.addEventListener("click", () => {
    const text = wrapper.dataset.matrix || "";
    navigator.clipboard.writeText(text)
      .then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => copyBtn.textContent = "Copy", 1600);
      })
      .catch(() => {
        copyBtn.textContent = "Error";
        setTimeout(() => copyBtn.textContent = "Copy", 1600);
      });
  });

  header.appendChild(title);
  header.appendChild(copyBtn);

  const metaLine = document.createElement("div");
  metaLine.className = "matrix-meta";
  metaLine.innerHTML = `
    <span class="meta-item">Rows: ${rows}</span>
    <span class="meta-item">Columns: ${cols}</span>
    <span class="meta-item">Cells: ${rows * cols}</span>
    <span class="meta-item">Pool size: ${pool.length}</span>
  `;

  const scroll = document.createElement("div");
  scroll.className = "matrix-scroll";

  const grid = document.createElement("div");
  grid.className = "matrix-grid";
  scroll.appendChild(grid);

  // Fill grid cells with final matrix text
  const lines = matrixText.split("\n");
  for (let r = 0; r < rows; r++) {
    const line = lines[r];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = line[c];
      grid.appendChild(cell);
    }
  }

  wrapper.appendChild(header);
  wrapper.appendChild(metaLine);
  wrapper.appendChild(scroll);
  return wrapper;
}

// ==== Temporary (Scramble) Block ====
function createTempBlock(rows, cols, pool) {
  const wrapper = document.createElement("article");
  wrapper.className = "matrix-wrapper";

  const header = document.createElement("div");
  header.className = "matrix-header";

  const title = document.createElement("h2");
  title.className = "matrix-title";
  title.innerHTML = `Matrix <span class="badge">#?</span>`;

  header.appendChild(title);
  wrapper.appendChild(header);

  const metaLine = document.createElement("div");
  metaLine.className = "matrix-meta";
  metaLine.innerHTML = `
    <span class="meta-item">Rows: ${rows}</span>
    <span class="meta-item">Columns: ${cols}</span>
    <span class="meta-item">Cells: ${rows * cols}</span>
    <span class="meta-item">Pool size: ${pool.length}</span>
    <span class="meta-item">Generating…</span>
  `;
  wrapper.appendChild(metaLine);

  const scroll = document.createElement("div");
  scroll.className = "matrix-scroll";

  const grid = document.createElement("div");
  grid.className = "matrix-grid";
  scroll.appendChild(grid);
  wrapper.appendChild(scroll);

  // Create cells once for animation
  const cells = createGrid(rows, cols, grid);
  return { wrapper, cells };
}

// ==== Validation ====
function validateInt(inputEl) {
  const val = parseInt(inputEl.value, 10);
  if (isNaN(val) || val <= 0) {
    inputEl.classList.add("invalid");
    setTimeout(() => inputEl.classList.remove("invalid"), 420);
    return null;
  }
  return val;
}

// ==== Main ====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("matrixForm");
  const rowsInput = document.getElementById("rows");
  const colsInput = document.getElementById("cols");
  const lettersCb = document.getElementById("letters");
  const numbersCb = document.getElementById("numbers");
  const specialsCb = document.getElementById("specials");
  const uppercaseCb = document.getElementById("uppercase");
  const lowercaseCb = document.getElementById("lowercase");
  const resetBtn = document.getElementById("resetBtn");
  const outputArea = document.getElementById("outputArea");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rows = validateInt(rowsInput);
    const cols = validateInt(colsInput);
    if (rows === null || cols === null) return;

    const cellsCount = rows * cols;
    if (cellsCount > MAX_SAFE_CELLS) {
      alert(`Matrix too large (${cellsCount} cells). Reduce size (limit ~ ${MAX_SAFE_CELLS}).`);
      return;
    }

    const pool = buildPool({
      letters: lettersCb.checked,
      numbers: numbersCb.checked,
      specials: specialsCb.checked,
      uppercase: uppercaseCb.checked,
      lowercase: lowercaseCb.checked
    });

    if (!pool.length) {
      alert("Select at least one character source (letters, numbers, specials).");
      return;
    }

    if (resetBtn.classList.contains("hidden")) {
      resetBtn.classList.remove("hidden");
    }

    // Temporary scramble block
    const { wrapper: tempWrapper, cells } = createTempBlock(rows, cols, pool);
    outputArea.insertBefore(tempWrapper, outputArea.firstChild);

    animateGrid(rows, cols, pool, cells, (finalMatrix) => {
      tempWrapper.remove();
      const finalBlock = createMatrixBlock(rows, cols, pool, finalMatrix, 0);
      outputArea.insertBefore(finalBlock, outputArea.firstChild);

      // Update badge numbering
      const blocks = [...outputArea.querySelectorAll(".matrix-wrapper")];
      blocks.forEach((blk, idx) => {
        const badge = blk.querySelector(".badge");
        if (badge) badge.textContent = `#${idx + 1}`;
      });
    });
  });

  resetBtn.addEventListener("click", () => {
    rowsInput.value = "";
    colsInput.value = "";
    outputArea.innerHTML = "";
    resetBtn.classList.add("hidden");
    rowsInput.focus();
  });
});