// Configuration
const SPECIAL_CHARS = "!@#$%^&*()-_=+[]{};:,.<>/?|~";
const ANIMATION_DURATION_MS = 650; // time each generation 'scrambles'
const TICK_INTERVAL_MS = 40;       // speed of scramble updates
const MAX_SAFE_CELLS = 200_000;    // guard against excessive matrices

// Build character pool from options
function buildPool(opts) {
  let pool = "";
  if (opts.letters) {
    if (opts.uppercase) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (opts.lowercase) pool += "abcdefghijklmnopqrstuvwxyz";
    // If letters checked but neither uppercase nor lowercase chosen, fallback both:
    if (!opts.uppercase && !opts.lowercase) {
      pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    }
  }
  if (opts.numbers) pool += "0123456789";
  if (opts.specials) pool += SPECIAL_CHARS;
  return pool;
}

// Generate a single matrix string (rows separated by newline)
function generateMatrix(rows, cols, pool) {
  const chars = [];
  const pLen = pool.length;
  for (let r = 0; r < rows; r++) {
    let line = "";
    for (let c = 0; c < cols; c++) {
      line += pool[Math.floor(Math.random() * pLen)];
    }
    chars.push(line);
  }
  return chars.join("\n");
}

// Animated scramble into final matrix
function animateMatrix(rows, cols, pool, displayEl, doneCallback) {
  const totalCells = rows * cols;
  if (totalCells === 0) {
    doneCallback("");
    return;
  }
  const pLen = pool.length;
  let start = performance.now();
  let lastTick = 0;
  let finalString = "";

  function tick(now) {
    if (now - lastTick >= TICK_INTERVAL_MS) {
      // scramble frame
      let lines = [];
      for (let r = 0; r < rows; r++) {
        let line = "";
        for (let c = 0; c < cols; c++) {
          line += pool[Math.floor(Math.random() * pLen)];
        }
        lines.push(line);
      }
      displayEl.textContent = lines.join("\n");
      lastTick = now;
    }
    if (now - start >= ANIMATION_DURATION_MS) {
      // Final stable matrix
      finalString = generateMatrix(rows, cols, pool);
      displayEl.textContent = finalString;
      doneCallback(finalString);
      return;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Create result block
function createMatrixBlock(matrixText, index, meta) {
  const wrapper = document.createElement("article");
  wrapper.className = "matrix-wrapper";

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
    navigator.clipboard.writeText(matrixText)
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
    <span class="meta-item">Rows: ${meta.rows}</span>
    <span class="meta-item">Columns: ${meta.cols}</span>
    <span class="meta-item">Cells: ${meta.rows * meta.cols}</span>
    <span class="meta-item">Pool size: ${meta.poolSize}</span>
  `;

  const display = document.createElement("pre");
  display.className = "matrix-display";
  display.textContent = matrixText;

  wrapper.appendChild(header);
  wrapper.appendChild(metaLine);
  wrapper.appendChild(display);
  return wrapper;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("matrixForm");
  const rowsInput = document.getElementById("rows");
  const colsInput = document.getElementById("cols");
  const lettersCb = document.getElementById("letters");
  const numbersCb = document.getElementById("numbers");
  const specialsCb = document.getElementById("specials");
  const uppercaseCb = document.getElementById("uppercase");
  const lowercaseCb = document.getElementById("lowercase");
  const generateBtn = document.getElementById("generateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const outputArea = document.getElementById("outputArea");

  function validateInt(inputEl) {
    const val = parseInt(inputEl.value, 10);
    if (isNaN(val) || val <= 0) {
      inputEl.classList.add("invalid");
      setTimeout(() => inputEl.classList.remove("invalid"), 420);
      return null;
    }
    return val;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const rows = validateInt(rowsInput);
    const cols = validateInt(colsInput);
    if (rows === null || cols === null) return;

    const cells = rows * cols;
    if (cells > MAX_SAFE_CELLS) {
      alert(`Matrix too large (${cells} cells). Please reduce size (limit ~ ${MAX_SAFE_CELLS}).`);
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
      alert("Please select at least one character source (letters, numbers, specials).");
      return;
    }

    // Show reset button after first generation
    if (resetBtn.classList.contains("hidden")) {
      resetBtn.classList.remove("hidden");
    }

    // Temporary block with animated scramble
    const tempWrapper = document.createElement("article");
    tempWrapper.className = "matrix-wrapper";
    const header = document.createElement("div");
    header.className = "matrix-header";
    const h2 = document.createElement("h2");
    h2.className = "matrix-title";
    h2.innerHTML = `Matrix <span class="badge">#?</span>`;
    header.appendChild(h2);
    tempWrapper.appendChild(header);

    const metaLine = document.createElement("div");
    metaLine.className = "matrix-meta";
    metaLine.innerHTML = `
      <span class="meta-item">Rows: ${rows}</span>
      <span class="meta-item">Columns: ${cols}</span>
      <span class="meta-item">Cells: ${cells}</span>
      <span class="meta-item">Pool size: ${pool.length}</span>
      <span class="meta-item">Generating…</span>
    `;
    tempWrapper.appendChild(metaLine);

    const display = document.createElement("pre");
    display.className = "matrix-display";
    display.textContent = "";
    tempWrapper.appendChild(display);

    outputArea.insertBefore(tempWrapper, outputArea.firstChild);

    // Animate scramble then replace with final block
    animateMatrix(rows, cols, pool, display, (finalMatrix) => {
      // Remove temporary wrapper
      tempWrapper.remove();

      // Create final block
      const finalBlock = createMatrixBlock(finalMatrix, 0, {
        rows, cols, poolSize: pool.length
      });
      outputArea.insertBefore(finalBlock, outputArea.firstChild);

      // Update badges for existing blocks
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